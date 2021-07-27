import subprocess
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "모든 데이터를 생성합니다."

    def handle(self, *args, **options):

        prefix = "python manage.py seed_"

        command_list = [
            prefix + "users --total 150",
            prefix + "constituents --total 150",
            prefix + "flavor_tags",
            prefix + "postings --total 200",
            prefix + "custom_lists --total 140",
        ]

        for command in command_list:
            # Popen쓰지 마라 여기서 멀티 프로세싱은 위험하다
            subprocess.run(command)
