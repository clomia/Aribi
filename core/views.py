import ast
from collections import defaultdict
from django.shortcuts import render, redirect
from django.urls import reverse
from django.db.models import Count
from postings.models import Posting
from archives.models import Constituent, FlavorTag
from users.models import User
from .function import tag_css_class_map

POSTING_RENDER_LIMIT = 300  # mini로 렌더링 되는 포스팅 갯수제한


class Intro:
    """인트로 페이지"""

    DEFAULT_POSTING_COUNT = 5

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
            postings = cls.get_latest_postings(offset=offset + cls.DEFAULT_POSTING_COUNT)
        elif order_by == "popularity":
            postings = cls.get_popularity_postings(offset=offset + cls.DEFAULT_POSTING_COUNT)
        return render(request, "partials/mini/postings.html", {"postings": postings})

    def search(word):
        """
        단어를 사용해서 기본 검색(필터링)을 진행한다

        대상은 포스팅 객체와 유저이며
        default 대상은 포스팅이다. 유저는 만약에 있다면 보여주겠다는 의도이다.

        포스팅 검색 알고리즘
        1. 포스팅이 가지는 수많은 속성들에 단어가 포함되어있다면 해당 포스팅들을 모두 가져온다.
        2. 가져온 포스팅중에서 단어가 포함된 속성이 많은 포스팅이 앞에 오도록 정렬한다.
        3. 속성갯수로 정렬한것을 유지하면서 좋아요가 높은 포스팅이 앞에 오도록 정렬한다.
        4. 속성연관성이 가장 높은 포스팅들만 max_ref로 분류하게 되는데, 이 포스팅들의 갯수를 제한한다.
            ( 태그가 너무 적게(ex 한개)가 들어왔다면 max_ref가 1이 되고 모두 max_ref로 분류된다. 같은 상황에 대한 대책 )
        5. 후처리....

        유저 검색 알고리즘
        1. 단어가 이름에 포함된 유저를 모두 가져온다.
        2. 단어와 일치하는 이름을 가진 유저들은 따로 분류해둔다.
        3. 단어와 일치하지 않고 단어가 포함되있는 이름을 가진 유저는 이름의 길이가 짧은것이 앞에 오도록 정렬한 뒤 갯수를 제한한다.
            ( 이름의 길이가 짧을수록 단어와 일치하기 때문. )
        5. 단어와 일치하는 이름을 가진 유저들과 정렬한 유저들을 합친다..
        """
        # -------- posting obj sort section ------------
        field = (
            list(Posting.objects.filter(cocktail_name__iregex=rf"{word}"))
            + list(Posting.objects.filter(created_by__name__iregex=rf"{word}"))
            + list(Posting.objects.filter(constituents__name__iregex=rf"{word}"))
            + list(Posting.objects.filter(flavor_tags__expression__iregex=rf"{word}"))
        )

        organized_field = defaultdict(list)
        # ref_count = field에 해당 포스팅이 얼마나 많이 있는가
        # organized_field = { ref_count: [ref_count에 해당하는 포스팅들..], ... }
        for posting, ref_count in ((posting, field.count(posting)) for posting in set(field)):
            organized_field[ref_count].append(posting)

        # organized_field[ref_count] 리스트들을 좋아요순으로 정렬한다.
        for section in organized_field.values():
            section.sort(key=lambda posting: posting.posting_likes.count(), reverse=True)

        # ref_count가 높은것부터 result에 추가한다.
        # -----최종 정렬 형태------
        # 1. ref_count가 높은것이 앞에 오도록
        # 2. 그 안에서는 좋아요가 많은게 앞에 오도록

        posting_result = []
        for ref_count in sorted(organized_field.keys(), reverse=True):
            posting_result.extend(organized_field[ref_count])

        # -------------- user obj search process section ----------
        users = list(User.objects.filter(name__iregex=rf"{word}"))

        # 단어와 완전히 일치하는 이름을 가진 유저는 따로 분류해둔다
        correct_user = [user for user in users if user.name == word]
        # 그 외에 단어를 포함하는 유저들은 유저이름의 글자길이가 작을수록 단어와 유사하다는 점을 이용해서 유사도로 정렬한다.
        other_user = sorted((user for user in users if user.name != word), key=lambda user: len(user.name))[:6]
        user_result = correct_user + other_user
        return (
            "page/search-result/main.html",
            {
                "postings": posting_result[:POSTING_RENDER_LIMIT],
                "users": user_result,
                "search_for": word,
            },
        )

    def tag_search(data_list):
        """data는 posting이다"""
        class_mapping = {
            "Constituent": Constituent,
            "FlavorTag": FlavorTag,
        }

        tags = []
        data_ground = []
        for data in data_list:
            data = ast.literal_eval(data)
            current_obj = class_mapping[data["class"]].objects.get(pk=data["pk"])
            tags.append(current_obj)
            data_ground.extend(current_obj.postings.all())

        # ? 태그 참조 갯수로 포스팅들을 분류, 정렬하는 로직입니다.
        organized = sorted(
            ({"data": data, "count": data_ground.count(data)} for data in set(data_ground)),
            key=lambda x: x["count"],
            reverse=True,
        )
        max_ref = organized[0]["count"] if organized else 0
        max_ref_postings = sorted(
            (i["data"] for i in organized if i["count"] == max_ref),
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
            "ref_postings": ref_postings[:POSTING_RENDER_LIMIT],
            "tag_data": [
                {"name": tag.expression, "kind": tag_css_class_map[tag.category]}
                if type(tag) is FlavorTag
                else {"name": tag.name, "kind": tag_css_class_map[tag.kind]}
                for tag in tags
            ],
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
        if value := content.get("search_for", None):
            search_for = value[0].strip()
            if not search_for:
                return redirect(reverse("core:intro"))

        if tag_list := content.get("tag", False):
            content["classifier"] = ["tag_search"]
            search_for = tag_list

        # func_mapping에 명시된 함수에 search_for 리스트를 준다.
        html, result = cls.func_mapping[content["classifier"][0]](search_for)
        # max_ref는 tag_search에서만 사용되는 값

        return render(request, html, {"content": result})
