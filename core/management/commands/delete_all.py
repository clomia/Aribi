from django.core.management.base import BaseCommand
from users.models import User
from archives.models import FlavorTag


class Command(BaseCommand):
    help = "데이터를 모두 삭제합니다. 이미지파일까지 삭제하지는 않습니다."

    def add_arguments(self, parser):
        parser.add_argument(
            "--pass",
            help="username을 입력하면 해당 유저데이터는 제거하지 않습니다",
            default="",
        )

    def handle(self, *args, **options):
        if not (username := options.get("pass")):
            User.objects.all().delete()
        else:
            User.objects.exclude(username=username).delete()
        FlavorTag.objects.all().delete()