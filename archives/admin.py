from django.contrib import admin
from . import models


class ImageInline(admin.StackedInline):
    """ 다른 Admin에 사진 모델을 같이 볼 수 있도록 만들어둔 클래스 """

    model = models.ConstituentImage


@admin.register(models.Constituent)
class ConstituentAdmin(admin.ModelAdmin):

    inlines = (ImageInline,)

    list_display = (
        "name",
        "kind",
        "alcohol",
        "created",
    )

    ordering = [
        "alcohol",
    ]


@admin.register(models.FlavorTag)
class FlavorTagAdmin(admin.ModelAdmin):

    list_display = (
        "expression",
        "category",
        "created",
    )