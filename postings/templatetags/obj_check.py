from django import template
from postings.models import Posting, PostingLike, Comment, CommentLike, Reply, ReplyLike
from users.models import User
from lists.models import CustomList

register = template.Library()


@register.filter
def posting_like_check(posting_pk, username):
    posting = Posting.objects.get(pk=int(posting_pk))
    try:
        user = User.objects.get(username=username)
        return True if PostingLike.objects.filter(created_by=user, posting=posting) else False
    except User.DoesNotExist:
        return False


@register.filter
def comment_like_check(comment_pk, username):
    comment = Comment.objects.get(pk=int(comment_pk))
    try:
        user = User.objects.get(username=username)
        return True if CommentLike.objects.filter(created_by=user, comment=comment) else False
    except User.DoesNotExist:
        return False


@register.filter
def reply_like_check(reply_pk, username):
    reply = Reply.objects.get(pk=int(reply_pk))
    try:
        user = User.objects.get(username=username)
        return True if ReplyLike.objects.filter(created_by=user, reply=reply) else False
    except User.DoesNotExist:
        return False


@register.filter
def posting_in_list(posting_pk, username):
    posting = Posting.objects.get(pk=int(posting_pk))
    try:
        user = User.objects.get(username=username)
        target_lists = CustomList.objects.filter(created_by=user)
        if not target_lists:
            target_list = CustomList.objects.create(created_by=user, name=user.username)
        else:
            target_list, *_ = target_lists
        return target_list.postings.filter(pk=posting.pk).exists()
    except User.DoesNotExist:
        return False
