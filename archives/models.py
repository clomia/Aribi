from django.db import models
from core.models import CoreModel


class Constituent(CoreModel):
    """ 칵테일의 재료와 용품 아카이브 모델입니다. """

    TYPE_LIQUID = "액체"
    TYPE_INGREDIENT = "재료"
    TYPE_EQUIPMENT = "용품"

    TYPE_CHOICES = (
        (TYPE_LIQUID, TYPE_LIQUID),
        (TYPE_INGREDIENT, TYPE_INGREDIENT),
        (TYPE_EQUIPMENT, TYPE_EQUIPMENT),
    )

    name = models.CharField(max_length=255)
    kind = models.CharField(max_length=50, choices=TYPE_CHOICES, null=False)
    description = models.TextField(blank=True)
    alcohol = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name


class ConstituentImage(CoreModel):
    """ 칵테일 재료,용품 이미지 모델입니다 """

    related_name = "constituent_images"

    image = models.ImageField(upload_to="archive_images", null=True, blank=True)
    constituent = models.ForeignKey("archives.Constituent", on_delete=models.CASCADE, related_name=related_name)

    def __str__(self):
        return f"[아카이브 사진] {self.constituent}"


class FlavorTag(CoreModel):
    """ 맛의 구성 아카이브 모델입니다. """

    CATEGORY_FRUIT = "과일맛"
    CATEGORY_PLANT = "식물맛"
    CATEGORY_TASTE = "기본맛"
    CATEGORY_SPICE = "향신료맛"
    CATEGORY_TEXTURE = "입안 감촉"
    CATEGORY_SCENT = "냄새"
    OTHER_FEATURE = "기타 특징"

    CATEGORY_CHOICE = (
        (CATEGORY_FRUIT, CATEGORY_FRUIT),
        (CATEGORY_PLANT, CATEGORY_PLANT),
        (CATEGORY_TASTE, CATEGORY_TASTE),
        (CATEGORY_SPICE, CATEGORY_SPICE),
        (CATEGORY_TEXTURE, CATEGORY_TEXTURE),
        (CATEGORY_SCENT, CATEGORY_SCENT),
        (OTHER_FEATURE, OTHER_FEATURE),
    )

    expression = models.CharField(max_length=255)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICE)

    def __str__(self):
        return self.expression
