from django.contrib import admin
from django.utils.html import mark_safe
from . import models


@admin.register(models.Posting)
class PostingAdmin(admin.ModelAdmin):

    list_display = ("cocktail_name", "created_by", "get_image")

    def get_image(self, obj):
        """ info: obj 인자로는 Posting객체가 들어온다 """
        print(f'<img width="50px" src="{obj.photo.url}" />')
        return mark_safe(f'<img width="50px" src="{obj.photo.url}" />')

    get_image.short_description = "Image"


@admin.register(models.Comment)
class CommentAdmin(admin.ModelAdmin):

    list_display = (
        "posting",
        "created_by",
        "parents",
        "content",
    )
