from django import template
from postings.models import Posting, PostingLike
from users.models import User

register = template.Library()


@register.filter
def posting_like_check(posting_pk, username):
    posting = Posting.objects.get(pk=int(posting_pk))
    user = User.objects.get(username=username)
    return True if PostingLike.objects.filter(created_by=user, posting=posting) else False
