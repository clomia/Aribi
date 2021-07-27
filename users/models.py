from django.contrib.auth.models import AbstractUser
from django.db import models
from core.models import CoreModel


class User(AbstractUser, CoreModel):
    """ 유저 모델입니다. """

    LOGIN_METHODS = (LOGIN_DEFAULT := "default", LOGING_KAKAO := "kakao", LOGIN_NAVER := "naver")
    LOGIN_CHOICES = tuple((i, i) for i in LOGIN_METHODS)

    login_method = models.CharField(max_length=50, choices=LOGIN_CHOICES, default=LOGIN_DEFAULT)
    profile_image = models.ImageField(upload_to="profile_images", blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.username
