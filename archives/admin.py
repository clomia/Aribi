from django.contrib import admin
from . import models

# Register your models here.


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
