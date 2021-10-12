import random, os
from typing import Callable, Tuple
from django.core.management.base import BaseCommand
from django_seed import Seed
from django.conf import settings
from archives.models import Constituent
from users.models import User
from tools.lorem import pylist_loader

MEDIA_ROOT = settings.MEDIA_ROOT


class Command(BaseCommand):

    help = "Constituent 데이터를 생성합니다."

    def add_arguments(self, parser):
        parser.add_argument(
            "--total",
            help="생성할 데이터의 갯수를 입력받습니다.",
            default=20,
        )

    def handle(self, *args, **options):

        elements, constituent_list = self.seed_supporter()

        def name(x):
            """이것이 호출될때마다 새로운 타입의 데이터 생성 함수를 만들어냅니다."""
            self.now_type = random.choice(constituent_list)
            _name = elements(self.now_type)[0]()
            try:
                Constituent.objects.get(name=_name)
            except Constituent.DoesNotExist:
                return _name
            else:
                return _name + str(random.randint(1, 10000))

        def kind(x):
            return elements(self.now_type)[1]()

        def alcohol(x):
            return elements(self.now_type)[2]()

        all_users = User.objects.all()
        total = int(options.get("total"))
        seeder = Seed.seeder(locale="ko_KR")
        seeder.add_entity(
            Constituent,
            total,
            {
                "name": name,
                "created_by": lambda x: random.choice(all_users),
                "kind": kind,
                "alcohol": alcohol,
            },
        )
        pk_list = seeder.execute()[Constituent]
        for pk in pk_list:
            constituent = Constituent.objects.get(pk=pk)
            if not constituent.name:
                # 약 2%확률로 이름없는 객체가 생성된다 원인을 못찾아서 일단 여기서 처리한다.
                constituent.delete()
                self.stdout.write(self.style.WARNING("잘못 생성된 객체를 제거하였습니다."))
            else:
                self.stdout.write(self.style.SUCCESS(constituent.name))

        self.stdout.write(self.style.SUCCESS(f"{total} constituents created!"))

    def seed_supporter(self) -> Tuple[Callable, Tuple]:
        """데이터 생성자 고차함수입니다."""

        constituent_list = ("alcoholic_drinks", "drinks", "ingredients", "equipments")

        lorem, *constituents = pylist_loader("lorems", *constituent_list)
        constituents = {key: value for key, value in zip(constituent_list, constituents)}

        def elements(container) -> Tuple[Callable]:
            """
            논리적으로 어긋나지 않도록 Seed를 도와준다.
            각 카테고리에 알맞게 값을 생성한다.

            스크랩된 데이터를 사용해서 값을 만든다.

            -술에 알콜이 기입될때는 10%확률로 오버프루프 도수를 기입해준다-
            """

            def name():
                """container라는 ref가 있기 때문에 lambda로 만들면 안된다."""
                return random.choice(constituents[container])

            if container == "alcoholic_drinks":
                alcohol = lambda: random.choice((random.randint(1, 49),) * 9 + (random.randint(1, 96),))
            else:
                alcohol = lambda: None

            type_dict = {
                "alcoholic_drinks": Constituent.TYPE_LIQUID,
                "drinks": Constituent.TYPE_LIQUID,
                "ingredients": Constituent.TYPE_INGREDIENT,
                "equipments": Constituent.TYPE_EQUIPMENT,
            }

            def kind():
                """container라는 ref가 있기 때문에 lambda로 만들면 안된다."""
                return type_dict[container]

            return name, kind, alcohol

        return elements, constituent_list
