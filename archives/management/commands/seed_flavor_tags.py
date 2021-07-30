from random import choice
from django.core.management.base import BaseCommand
from archives.models import FlavorTag
from users.models import User


class Command(BaseCommand):

    help = "flavor_tag 데이터를 생성합니다"

    def handle(self, *args, **options):

        all_users = User.objects.all()

        for category in self.FLAVOR_DATA:
            for flavor in self.FLAVOR_DATA[category]:
                FlavorTag.objects.create(
                    created_by=choice(all_users),
                    expression=flavor,
                    category=category,
                )
        self.stdout.write(self.style.SUCCESS(f"Flavor Tags created!"))

    FLAVOR_DATA = {
        FlavorTag.CATEGORY_FRUIT: (
            "오렌지맛",
            "레몬맛",
            "라임맛",
            "리치맛",
            "코코넛맛",
            "복숭아맛",
            "딸기맛",
            "멜론맛",
            "유자맛",
            "파인애플맛",
        ),
        FlavorTag.CATEGORY_PLANT: (
            "장미맛",
            "솔맛",
            "생강맛",
            "민트맛",
            "커피맛",
            "초콜릿(카카오)맛",
            "아몬드맛",
        ),
        FlavorTag.CATEGORY_TASTE: (
            "감칠맛",
            "단맛",
            "신맛",
            "쓴맛",
            "짠맛",
        ),
        FlavorTag.CATEGORY_SPICE: (
            "시나몬맛",
            "바닐라맛",
            "박하맛",
            "정향맛",
            "후추맛",
            "소금맛",
            "설탕맛",
        ),
        FlavorTag.CATEGORY_TEXTURE: (
            "균형감",
            "떫은맛",
            "목넘김",
            "무게감",
            "부드러운",
            "시원한",
            "여운",
            "자극적인 맛",
            "톡 쏘는 맛",
        ),
        FlavorTag.CATEGORY_SCENT: (
            "커피향",
            "알콜향",
            "민트향",
            "느끼한 향",
            "무취",
            "솔향",
        ),
        FlavorTag.CATEGORY_COLOR: (
            "빨강",
            "노랑",
            "초록",
            "파랑",
            "보라",
            "무색",
            "검정",
        ),
        FlavorTag.OTHER_FEATURE: (
            "불",
            "알콜을 코로마심",
        ),
    }
