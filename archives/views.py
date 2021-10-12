from django.shortcuts import render
from django.db.utils import IntegrityError
from django.http import HttpResponse
from archives.models import Constituent, FlavorTag
from users.models import User

kind_mapping = {
    "liquid": "액체",
    "ingredient": "재료",
    "equipment": "용품",
}
category_mapping = {
    "fruit": "과일맛",
    "plant": "식물맛",
    "taste": "기본맛",
    "spice": "향신료맛",
    "texture": "입안 감촉",
    "scent": "냄새",
    "color": "색감",
    "other": "기타 특징",
}


def create_tag_ajax(request):
    _class, name, _type, _alcohol, username = (
        request.POST.get("class"),
        request.POST.get("name"),
        request.POST.get("type"),
        int(request.POST.get("alcohol")),
        request.POST.get("username"),
    )
    created_by = User.objects.get(username=username)
    if _class == "constituents":
        try:
            alcohol = int(_alcohol)
            Constituent.objects.create(
                name=name,
                created_by=created_by,
                kind=kind_mapping[_type],
                alcohol=alcohol,
            )
            return HttpResponse("true")
        except IntegrityError:
            return HttpResponse("")
    elif _class == "flavor_tags":
        try:
            FlavorTag.objects.create(
                expression=name,
                created_by=created_by,
                category=category_mapping[_type],
            )
            return HttpResponse("true")
        except IntegrityError:
            return HttpResponse("")
