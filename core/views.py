import ast
from django.shortcuts import render, redirect
from django.urls import reverse
from django.db.models import Count
from postings.models import Posting
from archives.models import Constituent, FlavorTag

class_mapping = {
    "Constituent": Constituent,
    "FlavorTag": FlavorTag,
}


class Intro:
    """ 인트로 페이지"""

    def search(word):
        (word,) = word
        results = {
            "cocktail_name": Posting.objects.filter(cocktail_name__iregex=rf"{word}"),
            "created_by": Posting.objects.filter(created_by__username__iregex=rf"{word}"),
            "content": Posting.objects.filter(content__iregex=rf"{word}"),
            "constituents": Posting.objects.filter(constituents__name__iregex=rf"{word}"),
            "flavor_tags": Posting.objects.filter(flavor_tags__expression__iregex=rf"{word}"),
        }

        return "page/search_result/main.html", {key: set(value) for key, value in results.items() if value}

    def tag_search(data_list):
        """ data는 posting이다 """
        data_ground = []
        for data in data_list:
            data = ast.literal_eval(data)
            current_obj = class_mapping[data["class"]].objects.get(pk=data["pk"])
            data_ground.extend(current_obj.postings.all())

        organized = [{"data": data, "count": data_ground.count(data)} for data in set(data_ground)]
        organized.sort(key=lambda x: x["count"], reverse=True)

        return "page/tagsearch-result/main.html", organized

    func_mapping = {
        "search": search,
        "tag_search": tag_search,
    }

    @classmethod
    def main(cls, request):
        """
        htnml에 DOM을 뿌린 후 JavaScript에서 가져가도록 합니다.

        JavaScript가 두 클래스를 동시에 뿌릴 수 있도록 zip을 써서 데이터를 가공함
        즉, 앞단에서는 포스팅 갯수 많은 순서대로 constituent,flavorTag가 순서대로 뿌려짐
        """

        # 포스팅에 많이 사용된 태그가 앞에 오도록 정렬
        organize = lambda model: model.objects.all().annotate(reference_count=Count("postings")).order_by("-reference_count")
        tags = []

        for constituent, flavor_tag in zip(organize(Constituent), organize(FlavorTag)):
            tags.append(
                {
                    "content": constituent.name.replace("\n", ""),
                    "class": "Constituent",
                    "type": constituent.kind,
                    "alcohol": True if (v := constituent.alcohol) and v > 0 else False,
                    "pk": constituent.pk,
                }
            )
            tags.append(
                {
                    "content": flavor_tag.expression.replace("\n", ""),
                    "class": "FlavorTag",
                    "type": flavor_tag.category,
                    "alcohol": False,
                    "pk": flavor_tag.pk,
                }
            )

        return render(request, "page/intro/main.html", {"tags": tags})

    @classmethod
    def search_progress(cls, request):

        content = dict(request.POST)
        if tag_list := content.get("tag", False):
            content["classifier"] = ["tag_search"]
            content["search_for"] = tag_list

        # func_mapping에 명시된 함수에 content["search_for"] 리스트를 준다.
        html, result = cls.func_mapping[content["classifier"][0]](content["search_for"])

        return render(request, html, {"content": result, "posting": result[0]["data"]})  #! posting은 테스트를 위한 key:value 이다
