from django.db import models
from core.models import CoreModel


class Posting(CoreModel):
    """ 포스팅 모델입니다. """

    related_name = "postings"

    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name=related_name)
    cocktail_name = models.CharField(max_length=255)
    photo = models.ImageField()
    content = models.TextField(null=True, blank=True)
    constituent = models.ManyToManyField("archives.Constituent", related_name=related_name)
    flavor_tag = models.ManyToManyField("archives.FlavorTag", related_name=related_name)

    def __str__(self):
        return f"{self.created_by}: {self.cocktail_name}"


class Comment(CoreModel):
    """ 포스팅에 달리는 코멘트 모델입니다. """

    related_name = "comments"

    posting = models.ForeignKey("postings.Posting", on_delete=models.CASCADE, related_name=related_name)
    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name=related_name)
    parents = models.ForeignKey("self", on_delete=models.CASCADE, related_name="reply", null=True, blank=True)
    photo = models.ImageField(null=True, blank=True)
    score = models.SmallIntegerField(null=True, blank=True)
    content = models.TextField()

    def __str__(self):
        return f"{self.created_by}: {self.content[:25]}{'...' if len(self.content) > 10 else ''}"


class Like(CoreModel):
    """ 포스팅에 달리는 좋아요 모델입니다. """

    related_name = "likes"

    posting = models.ForeignKey("postings.Posting", on_delete=models.CASCADE, related_name=related_name)
    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name=related_name)

    def __str__(self):
        return f"{self.created_by} -> [{self.posting}]"
