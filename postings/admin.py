from django.contrib import admin
from . import models


@admin.register(models.Posting)
class PostingAdmin(admin.ModelAdmin):

    list_display = (
        "cocktail_name",
        "created_by",
    )


@admin.register(models.Comment)
class CommentAdmin(admin.ModelAdmin):

    list_display = (
        "posting",
        "created_by",
        "parents",
        "content",
    )
