from django.contrib import admin
from . import models


@admin.register(models.Constituent)
class ConstituentAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "kind",
        "alcohol",
    )

    ordering = [
        "alcohol",
    ]


@admin.register(models.FlavorTag)
class FlavorTagAdmin(admin.ModelAdmin):

    list_display = (
        "expression",
        "category",
    )