from django.db import models
from django_resized import ResizedImageField
from core.models import CoreModel


class Constituent(CoreModel):
    """칵테일의 재료와 용품 아카이브 모델입니다."""

    related_name = "constituents"

    TYPES = (TYPE_LIQUID := "액체", TYPE_INGREDIENT := "재료", TYPE_EQUIPMENT := "용품")
    TYPE_CHOICES = tuple((i, i) for i in TYPES)

    name = models.CharField(max_length=255, unique=True)
    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name=related_name)
    kind = models.CharField(max_length=50, choices=TYPE_CHOICES, null=False)
    alcohol = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name


class FlavorTag(CoreModel):
    """맛의 구성 아카이브 모델입니다."""

    CATEGORIES = (
        CATEGORY_FRUIT := "과일맛",
        CATEGORY_PLANT := "식물맛",
        CATEGORY_TASTE := "기본맛",
        CATEGORY_SPICE := "향신료맛",
        CATEGORY_TEXTURE := "입안 감촉",
        CATEGORY_SCENT := "냄새",
        CATEGORY_COLOR := "색감",
        OTHER_FEATURE := "기타 특징",
    )

    CATEGORY_CHOICE = tuple((i, i) for i in CATEGORIES)

    related_name = "flavor_tags"

    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name=related_name)
    expression = models.CharField(max_length=255, unique=True)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICE)

    def __str__(self):
        return self.expression
