from django.contrib import admin
from lists import models


@admin.register(models.CustomList)
class CustomListAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "created_by",
        "created",
    )
    search_fields = (
        "name",
        "created_by__username",
        "postings__cocktail_name",
    )
    filter_horizontal = ("postings",)
    raw_id_fields = ("created_by",)
    ordering = ("-created",)
