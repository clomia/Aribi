from django.db import models
from core.models import CoreModel


class Constituent(CoreModel):

    TYPE_LIQUID = "액체"
    TYPE_INGREDIENT = "재료"
    TYPE_EQUIPMENT = "용품"

    TYPE_CHOICES = (
        (TYPE_LIQUID, TYPE_LIQUID),
        (TYPE_INGREDIENT, TYPE_INGREDIENT),
        (TYPE_EQUIPMENT, TYPE_EQUIPMENT),
    )

    name = models.CharField(max_length=50)
    kind = models.CharField(max_length=20, choices=TYPE_CHOICES, null=True)
    image = models.ImageField(null=True, blank=True)
    description = models.TextField(blank=True)
    alcohol = models.IntegerField(null=True, blank=True)

    def get_absolute_url(self):
        """어드민에서 웹으로 이동하는 버튼 생기는 함수"""
        # return reverse("model_detail", kwargs={"pk": self.pk})
        pass


class FlavorTag(CoreModel):

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

    expression = models.CharField(max_length=15)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICE)

    def __str__(self):
        return self.expression

    class Meta:
        verbose_name_plural = "Flavor"
