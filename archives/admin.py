from django.contrib import admin
from . import models


@admin.register(models.Constituent)
class ConstituentAdmin(admin.ModelAdmin):

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
        """포스팅에 사용된 횟수입니다"""
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
        """포스팅에 사용된 횟수입니다"""
        return obj.postings.all().count()
