from django.shortcuts import render, redirect
from django.urls import reverse
from postings.models import Posting
from archives.models import Constituent, FlavorTag


class Intro:
    """ 인트로 페이지"""

    def search(word):
        results = [
            cocktail_name := Posting.objects.filter(cocktail_name__iregex=rf"{word}"),
            created_by := Posting.objects.filter(created_by__username__iregex=rf"{word}"),
            content := Posting.objects.filter(content__iregex=rf"{word}"),
            constituents := Posting.objects.filter(constituents__name__iregex=rf"{word}"),
            flavor_tags := Posting.objects.filter(flavor_tags__expression__iregex=rf"{word}"),
            flavor_tags_category := Posting.objects.filter(flavor_tags__category__iregex=rf"{word}"),
        ]

        print(fr"{word}")
        print(result)

    def tag_search(tag):
        pass

    func_mapping = {
        "search": search,
        "tag_search": tag_search,
    }

    @classmethod
    def main(cls, request):
        return render(request, "intro/main.html", {})

    @classmethod
    def search_progress(cls, request):
        content = request.POST
        print(content)
        cls.func_mapping[content["classifier"]](content["search_for"])

        return render(request, "intro/main.html", {})
