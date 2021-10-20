from django.contrib import admin
from django.utils.html import mark_safe
from django.db.models import F
from postings import models


class PictureInline(admin.StackedInline):
    """다른 Admin에 사진 모델을 같이 볼 수 있도록 만들어둔 클래스"""

    model = models.Picture


class CommentInline(admin.StackedInline):

    model = models.Comment


class PostingLikeInline(admin.StackedInline):

    model = models.PostingLike


class CommentLikeInline(admin.StackedInline):

    model = models.CommentLike


class ReplyLikeInline(admin.StackedInline):

    model = models.ReplyLike


class ReplyInline(admin.StackedInline):

    model = models.Reply


@admin.register(models.Posting)
class PostingAdmin(admin.ModelAdmin):
    """포스팅 Admin 정의"""

    list_per_page = 10

    list_display = (
        "cocktail_name",
        "like_counter",
        "created_by",
        "get_image",
        "created",
        "created_ago",
    )
    ordering = ("-created",)

    raw_id_fields = ("created_by",)
    search_fields = (
        "cocktail_name",
        "created_by__username",
        "constituents__name",
        "flavor_tags__expression",
        "flavor_tags__category",
    )
    filter_horizontal = (
        "constituents",
        "flavor_tags",
    )

    inlines = (PictureInline, PostingLikeInline, CommentInline)

    def get_image(self, obj):
        """info: obj 인자로는 Posting객체가 들어온다"""

        return mark_safe(f'<img width="50px" src="{obj.pictures.all()[0].image.url}" />')

    def like_counter(self, obj):
        return obj.posting_likes.count()

    get_image.short_description = "Picture"
    like_counter.short_description = "Likes"


@admin.register(models.Comment)
class CommentAdmin(admin.ModelAdmin):

    list_per_page = 50

    list_display = (
        "created_by",
        "content",
        "like_counter",
        "reply_counter",
        "posting",
        "created",
    )
    search_fields = (
        "posting__cocktail_name",
        "created_by__username",
        "content",
    )

    ordering = ("-created",)
    raw_id_fields = ("created_by",)

    inlines = (
        CommentLikeInline,
        ReplyInline,
    )

    def reply_counter(self, obj):
        return obj.replies.all().count()

    def like_counter(self, obj):
        return obj.comment_likes.count()

    reply_counter.short_description = "replies"
    like_counter.short_description = "Likes"


@admin.register(models.Reply)
class ReplyAdmin(admin.ModelAdmin):

    list_per_page = 50

    list_display = (
        "content",
        "like_counter",
        "comment",
        "created_by",
        "created",
    )
    search_fields = (
        "comment__content",
        "created_by__username",
        "content",
    )

    ordering = ("-created",)
    raw_id_fields = ("created_by",)

    inlines = (ReplyLikeInline,)

    def like_counter(self, obj):
        return obj.reply_likes.count()

    like_counter.short_description = "Likes"
