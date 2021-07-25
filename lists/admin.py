from django.contrib import admin
from . import models


@admin.register(models.CustomList)
class CustomListAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "created_by",
    )
