from django.contrib.auth.models import AbstractUser
from django.db import models
from django_resized import ResizedImageField
from core.models import CoreModel


class User(AbstractUser, CoreModel):
    """유저 모델입니다."""

    LOGIN_METHODS = (
        LOGIN_DEFAULT := "default",
        LOGIN_KAKAO := "kakao",
        LOGIN_NAVER := "naver",
        LOGIN_GITHUB := "github",
    )
    LOGIN_CHOICES = tuple((i, i) for i in LOGIN_METHODS)

    # ? username은 유저의 고윳값이며 이 name 필드를 사용자명으로 사용합니다.
    name = models.CharField(max_length=20, unique=False)
    REQUIRED_FIELDS = ["name"]

    login_method = models.CharField(max_length=50, choices=LOGIN_CHOICES, default=LOGIN_DEFAULT)
    profile_image = ResizedImageField(
        upload_to="profile_images",
        size=[170, 170],
        crop=["middle", "center"],
        quality=-1,
        default="profile_images/default-profile.jpg",
    )
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.name
