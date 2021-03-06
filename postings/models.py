from django.db import models
from django.shortcuts import reverse
from django.db.models import Count
from django_resized import ResizedImageField
from core.models import CoreModel


class Posting(CoreModel):
    """포스팅 모델입니다."""

    related_name = "postings"

    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name=related_name)
    cocktail_name = models.CharField(max_length=255)
    content = models.TextField(null=True, blank=True)
    constituents = models.ManyToManyField("archives.Constituent", related_name=related_name)
    flavor_tags = models.ManyToManyField("archives.FlavorTag", related_name=related_name)

    def __str__(self):
        return f"{self.created_by} - {self.cocktail_name}"

    def top_comment(self):
        """좋아요 갯수를 기준으로 상위 3개의 댓글을 반환합니다"""
        organize = self.comments.all().annotate(likes=Count("comment_likes")).order_by("-likes")
        return organize[:3]


class Picture(CoreModel):
    """포스팅에 담기는 사진을 다루는 모델입니다."""

    related_name = "pictures"

    image = ResizedImageField(upload_to="postings")
    posting = models.ForeignKey("postings.Posting", on_delete=models.CASCADE, related_name=related_name)

    def __str__(self):
        return f"[포스팅 사진] {self.posting}"


class Comment(CoreModel):
    """포스팅에 달리는 Comment 모델입니다."""

    related_name = "comments"

    posting = models.ForeignKey("postings.Posting", on_delete=models.CASCADE, related_name=related_name)
    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name=related_name)
    content = models.TextField()

    def __str__(self):
        return f"{self.created_by}: {self.content[:25]}{'...' if len(self.content) > 10 else ''}"


class Reply(CoreModel):
    """Comment 에달리는 Reply 모델입니다."""

    related_name = "replies"

    comment = models.ForeignKey("postings.Comment", on_delete=models.CASCADE, related_name=related_name)
    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name=related_name)
    content = models.TextField()

    def __str__(self):
        return f"[Reply to {self.comment.created_by}]{self.created_by}: {self.content[:25]}{'...' if len(self.content) > 10 else ''}"


class PostingLike(CoreModel):
    """포스팅에 달리는 좋아요 모델입니다."""

    related_name = "posting_likes"

    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name=related_name)
    posting = models.ForeignKey("postings.Posting", on_delete=models.CASCADE, related_name=related_name)

    def __str__(self):
        return f"{self.created_by} -> [{self.posting}]"


class CommentLike(CoreModel):
    """댓글에 달리는 좋아요 모델입니다."""

    related_name = "comment_likes"

    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name=related_name)
    comment = models.ForeignKey("postings.Comment", on_delete=models.CASCADE, related_name=related_name)

    def __str__(self):
        return f"{self.created_by} -> [{self.comment}]"


class ReplyLike(CoreModel):
    """답글에 달리는 좋아요 모델입니다."""

    related_name = "reply_likes"

    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name=related_name)
    reply = models.ForeignKey("postings.Reply", on_delete=models.CASCADE, related_name=related_name)

    def __str__(self):
        return f"{self.created_by} -> [{self.reply}]"
