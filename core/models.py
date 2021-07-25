from django.db import models


class CoreModel(models.Model):

    """모델의 생성시간과 수정시간이 기록되는 추상모델입니다."""

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
