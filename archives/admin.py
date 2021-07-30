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
        "reference_count",
        "created",
    )
    search_fields = (
        "name",
        "created_by__username",
        "kind",
    )
    list_filter = ("kind",)

    raw_id_fields = ("created_by",)

    ordering = ("-created",)

    def reference_count(self, obj):
        """ 포스팅에 사용된 횟수입니다 """
        return obj.postings.all().count()


@admin.register(models.FlavorTag)
class FlavorTagAdmin(admin.ModelAdmin):

    list_display = (
        "expression",
        "category",
        "reference_count",
        "created",
    )
    search_fields = (
        "expression",
        "created_by__username",
        "category",
    )
    list_filter = ("category",)
    raw_id_fields = ("created_by",)

    ordering = ("-created",)

    def reference_count(self, obj):
        """ 포스팅에 사용된 횟수입니다 """
        return obj.postings.all().count()