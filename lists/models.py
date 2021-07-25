from django.db import models
from core.models import CoreModel


class CustomList(CoreModel):
    """
    칵테일 리스트 모델입니다.
    유저가 원하는대로 리스트를 만듭니다.
    """

    related_name = "custom_lists"

    name = models.CharField(max_length=255)
    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name=related_name)
    postings = models.ManyToManyField("postings.Posting", related_name=related_name)

    def __str__(self):
        return self.name
