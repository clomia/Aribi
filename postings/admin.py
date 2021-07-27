from django.contrib import admin
from django.utils.html import mark_safe
from . import models


class PictureInline(admin.StackedInline):
    """ 다른 Admin에 사진 모델을 같이 볼 수 있도록 만들어둔 클래스 """

    model = models.Picture


class CommentInline(admin.StackedInline):

    model = models.Comment


class LikeInline(admin.StackedInline):

    model = models.Like


class ReplyInline(admin.StackedInline):

    model = models.Reply


@admin.register(models.Posting)
class PostingAdmin(admin.ModelAdmin):
    """ 포스팅 Admin 정의 """

    list_display = (
        "cocktail_name",
        "created_by",
        "get_image",
        "created",
    )

    raw_id_fields = ("created_by",)

    inlines = (PictureInline, LikeInline, CommentInline)

    def get_image(self, obj):
        """ info: obj 인자로는 Posting객체가 들어온다 """

        return mark_safe(f'<img width="50px" src="{obj.pictures.all()[0].image.url}" />')

    get_image.short_description = "Picture"


@admin.register(models.Comment)
class CommentAdmin(admin.ModelAdmin):

    list_display = (
        "created_by",
        "content",
        "posting",
        "get_image",
        "score",
    )

    raw_id_fields = ("created_by",)

    inlines = (ReplyInline,)

    def get_image(self, obj):
        """ info: obj 인자로는 Comment객체가 들어온다 """
        if obj.photo:
            return mark_safe(f'<img width="50px" src="{obj.photo.url}" />')

    get_image.short_description = "Comment Image"
