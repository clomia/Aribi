from django.db import models
from core.models import CoreModel


class Posting(CoreModel):

    related_name = "postings"

    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name=related_name)
    title = models.CharField(max_length=50)
    photo = models.ImageField()
    content = models.TextField()
    constituent = models.ManyToManyField("archives.Constituent", related_name=related_name)
    flavor_tag = models.ManyToManyField("archives.FlavorTag", related_name=related_name)


class Comment(CoreModel):

    related_name = "comments"

    post = models.ForeignKey("postings.Posting", on_delete=models.CASCADE, related_name=related_name)
    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name=related_name)
    photo = models.ImageField(blank=True, null=True)
    content = models.TextField()


class Like(CoreModel):

    related_name = "likes"

    post = models.ForeignKey("postings.Posting", on_delete=models.CASCADE, related_name=related_name)
    created_by = models.ForeignKey("users.User", on_delete=models.SET_NULL, null=True)
