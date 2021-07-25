from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """ 유저 모델입니다. """

    LOGIN_DEFAULT = "default"
    LOGING_KAKAO = "kakao"
    LOGIN_NAVER = "naver"

    LOGIN_CHOICES = (
        (LOGIN_DEFAULT, "Default"),
        (LOGING_KAKAO, "Kakao"),
        (LOGIN_NAVER, "Naver"),
    )

    login_method = models.CharField(max_length=50, choices=LOGIN_CHOICES, default=LOGIN_DEFAULT)
    profile_image = models.ImageField(upload_to="profile_images", blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.username
