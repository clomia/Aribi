import ast
from django.shortcuts import render
from django.db.models import Count
from postings.models import Posting
from archives.models import Constituent, FlavorTag

class_mapping = {
    "Constituent": Constituent,
    "FlavorTag": FlavorTag,
}

DEFAULT_POSTING_COUNT = 5


class Intro:
    """인트로 페이지"""

    def get_popularity_postings(*, offset: int, step=DEFAULT_POSTING_COUNT):
        # ? 관계형 필드로 정렬할때 .all().annotate를 사용하지 않으면 이상한 결과가 나오더라
        return Posting.objects.all().annotate(likes=Count("posting_likes")).order_by("-likes")[offset : offset + step]

    def get_latest_postings(*, offset: int, step=DEFAULT_POSTING_COUNT):
        return Posting.objects.order_by("-created")[offset : offset + step]

    @classmethod
    def posting_loader(cls, request):
        """만약 더이상 로딩할게 없으면 postings는 빈 QuerySet이 된다. 아무런 문제 없다."""
        order_by, offset = request.POST.get("order_by"), int(request.POST.get("offset"))
        if order_by == "latest":
            postings = cls.get_latest_postings(offset=offset + DEFAULT_POSTING_COUNT)
        elif order_by == "popularity":
            postings = cls.get_popularity_postings(offset=offset + DEFAULT_POSTING_COUNT)
        return render(request, "partials/mini/postings.html", {"postings": postings})

    def search(word):
        results = {
            "cocktail_name": Posting.objects.filter(cocktail_name__iregex=rf"{word}"),
            "created_by": Posting.objects.filter(created_by__name__iregex=rf"{word}"),
            "content": Posting.objects.filter(content__iregex=rf"{word}"),
            "constituents": Posting.objects.filter(constituents__name__iregex=rf"{word}"),
            "flavor_tags": Posting.objects.filter(flavor_tags__expression__iregex=rf"{word}"),
        }

        return "page/search-result/main.html", {key: set(value) for key, value in results.items() if value}

    def tag_search(data_list):
        """data는 posting이다"""

        data_ground = []
        for data in data_list:
            data = ast.literal_eval(data)
            current_obj = class_mapping[data["class"]].objects.get(pk=data["pk"])
            data_ground.extend(current_obj.postings.all())

        # ? 태그 참조 갯수로 포스팅들을 분류, 정렬하는 로직입니다.
        organized = sorted(
            [{"data": data, "count": data_ground.count(data)} for data in set(data_ground)],
            key=lambda x: x["count"],
            reverse=True,
        )
        max_ref = organized[0]["count"]
        max_ref_postings = sorted(
            [i["data"] for i in organized if i["count"] == max_ref],
            key=lambda posting: posting.posting_likes.count(),
            reverse=True,
        )
        ref_postings = [i["data"] for i in organized if i["count"] != max_ref]

        # max_ref인 포스팅은 포스팅을 그대로 렌더링하는데 그것이 10개가 넘지 못하도록 한다.
        MAX_REF_LIMIT = 7
        if len(max_ref_postings) > MAX_REF_LIMIT:
            ref_postings = max_ref_postings[MAX_REF_LIMIT:] + ref_postings
            max_ref_postings = max_ref_postings[:MAX_REF_LIMIT]

        return "page/tagsearch-result/main.html", {
            "max_ref_postings": max_ref_postings,
            "ref_postings": ref_postings,
        }

    func_mapping = {
        "search": search,
        "tag_search": tag_search,
    }

    @classmethod
    def main(cls, request):
        """
        html에 DOM을 뿌린 후 JavaScript에서 가져가도록 합니다.

        JavaScript가 두 클래스를 동시에 뿌릴 수 있도록 zip을 써서 데이터를 가공함
        즉, 앞단에서는 포스팅 갯수 많은 순서대로 constituent,flavorTag가 순서대로 뿌려짐
        """

        # 포스팅에 많이 사용된 태그가 앞에 오도록 정렬
        # ? annotate를 사용해서 reference_count 피쳐를 만든 뒤, order_by에서 해당 피쳐를 사용해 정렬하는 코드입니다.
        organize = lambda model: model.objects.all().annotate(reference_count=Count("postings")).order_by("-reference_count")
        tags = []

        for constituent in organize(Constituent):
            tags.append(
                {
                    "content": constituent.name.replace("\n", ""),
                    "class": "Constituent",
                    "type": constituent.kind,
                    "alcohol": True if (v := constituent.alcohol) and v > 0 else False,
                    "pk": constituent.pk,
                }
            )
        for flavor_tag in organize(FlavorTag):
            tags.append(
                {
                    "content": flavor_tag.expression.replace("\n", ""),
                    "class": "FlavorTag",
                    "type": flavor_tag.category,
                    "alcohol": False,
                    "pk": flavor_tag.pk,
                }
            )

        return render(
            request,
            "page/intro/main.html",
            {
                "tags": tags,
                "popularity_postings": cls.get_popularity_postings(offset=0),
                "latest_postings": cls.get_latest_postings(offset=0),
            },
        )

    @classmethod
    def search_progress(cls, request):

        content = dict(request.POST)
        if tag_list := content.get("tag", False):
            content["classifier"] = ["tag_search"]
            content["search_for"] = tag_list

        # func_mapping에 명시된 함수에 content["search_for"] 리스트를 준다.
        html, result = cls.func_mapping[content["classifier"][0]](content["search_for"])
        # max_ref는 tag_search에서만 사용되는 값

        return render(request, html, {"content": result})
