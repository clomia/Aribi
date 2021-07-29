from django.shortcuts import render, redirect
from django.urls import reverse
from postings.models import Posting
from archives.models import Constituent, FlavorTag


class Intro:
    """ 인트로 페이지"""

    def search(word):
        results = {
            "cocktail_name": Posting.objects.filter(cocktail_name__iregex=rf"{word}"),
            "created_by": Posting.objects.filter(created_by__username__iregex=rf"{word}"),
            "content": Posting.objects.filter(content__iregex=rf"{word}"),
            "constituents": Posting.objects.filter(constituents__name__iregex=rf"{word}"),
            "flavor_tags": Posting.objects.filter(flavor_tags__expression__iregex=rf"{word}"),
        }

        return {key: value for key, value in results.items() if value}

    def tag_search(*tags):
        pass

    func_mapping = {
        "search": search,
        "tag_search": tag_search,
    }

    @classmethod
    def main(cls, request):
        """ htnml에 DOM을 뿌린 후 JavaScript에서 가져가도록 합니다, 최신게 Array의 가장 앞에 있도록 함. """
        organize = lambda model: model.objects.all().order_by("-created")
        tags = []
        for constituent, flavor_tag in zip(organize(Constituent), organize(FlavorTag)):
            tags.append(
                {
                    "content": constituent.name,
                    "class": "Constituent",
                    "type": constituent.kind,
                    "alcohol": True if (v := constituent.alcohol) and v > 0 else False,
                    "pk": constituent.pk,
                }
            )
            tags.append(
                {
                    "content": flavor_tag.expression,
                    "class": "FlavorTag",
                    "type": flavor_tag.category,
                    "alcohol": False,
                    "pk": flavor_tag.pk,
                }
            )

        return render(request, "intro/main.html", {"tags": tags})

    @classmethod
    def search_progress(cls, request):
        content = request.POST
        print(content)
        result = cls.func_mapping[content["classifier"]](content["search_for"])

        return render(request, "intro/search_result.html", {"result": result})
