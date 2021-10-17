import random, os
from itertools import cycle
from django.core.management.base import BaseCommand
from django.conf import settings
from django_seed import Seed
from users.models import User


class Command(BaseCommand):
    def __init__(self, *args, **kwargs):
        """관리자 계정 생성"""
        # * 이것이 잘 작동한다는것은 확인되었습니다.
        self.get_gender = cycle((True, False))
        self.name = None
        super().__init__(*args, **kwargs)

    def handle(self, *args, **options):
        username = os.environ.get("ARIBI_USERNAME")
        email = os.environ.get("ARIBI_EMAIL")
        password = os.environ.get("ARIBI_PASSWORD")
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            User.objects.create_superuser(username, email, password)
            self.stdout.write(self.style.SUCCESS(f"관리자 계정이 생성되었습니다!"))
        else:
            self.stdout.write(self.style.SUCCESS(f"관리자 계정이 이미 존재합니다. ({username} - {email})"))
