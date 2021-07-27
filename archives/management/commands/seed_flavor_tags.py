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
            "오렌지",
            "레몬",
            "라임",
            "리치",
            "코코넛",
            "복숭아",
            "딸기",
            "멜론",
            "유자",
            "파인애플",
        ),
        FlavorTag.CATEGORY_PLANT: (
            "장미",
            "솔",
            "생강",
            "민트",
            "커피",
            "초콜릿(카카오)",
            "아몬드",
        ),
        FlavorTag.CATEGORY_TASTE: (
            "감칠맛",
            "단만",
            "신맛",
            "쓴맛",
            "짠맛",
        ),
        FlavorTag.CATEGORY_SPICE: (
            "시나몬",
            "바닐라",
            "박하",
            "정향",
            "후추",
            "소금",
            "설탕",
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
