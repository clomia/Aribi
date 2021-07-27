from django.contrib import admin
from django.utils.html import mark_safe
from . import models


class PictureInline(admin.StackedInline):
    """ 다른 Admin에 사진 모델을 같이 볼 수 있도록 만들어둔 클래스 """

    model = models.Picture


@admin.register(models.Posting)
class PostingAdmin(admin.ModelAdmin):
    """ 포스팅 Admin 정의 """

    list_display = (
        "cocktail_name",
        "created_by",
        "get_image",
        "created",
    )

    inlines = (PictureInline,)

    def get_image(self, obj):
        """ info: obj 인자로는 Posting객체가 들어온다 """

        return mark_safe(f'<img width="50px" src="{obj.pictures.all()[0].image.url}" />')

    get_image.short_description = "Picture"


@admin.register(models.Picture)
class PictureAdmin(admin.ModelAdmin):

    list_display = (
        "posting",
        "get_image",
        "created",
    )

    def get_image(self, obj):
        """ info: obj 인자로는 Picture객체가 들어온다 """

        return mark_safe(f'<img width="50px" src="{obj.image.url}" />')

    get_image.short_description = "Image"


@admin.register(models.Comment)
class CommentAdmin(admin.ModelAdmin):

    list_display = (
        "posting",
        "created_by",
        "parents",
        "content",
        "created",
    )
