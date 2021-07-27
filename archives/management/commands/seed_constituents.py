import random
from typing import Callable, Tuple
from django.core.management.base import BaseCommand
from django_seed import Seed
from archives.models import Constituent, FlavorTag
from tools.lorem import pylist_reader


class Command(BaseCommand):

    help = "Constituent 데이터를 생성합니다."

    def add_arguments(self, parser):
        parser.add_argument(
            "--total",
            help=help,
            default=20,
        )

    def handle(self, *args, **options):

        description, elements, constituent_list = self.seed_supporter()

        def name(x):
            """ 이것이 호출될때마다 새로운 타입의 데이터 생성 함수를 만들어냅니다. """
            self.now_type = random.choice(constituent_list)
            return elements(self.now_type)[0]()

        def kind(x):
            return elements(self.now_type)[1]()

        def alcohol(x):
            return elements(self.now_type)[2]()

        total = int(options.get("total"))
        seeder = Seed.seeder(locale="ko_KR")
        seeder.add_entity(
            Constituent,
            total,
            {
                "name": name,
                "description": description,
                "kind": kind,
                "alcohol": alcohol,
            },
        )
        seeder.execute()
        self.stdout.write(self.style.SUCCESS(f"{total} constituents created!"))

    def seed_supporter(self) -> Tuple[Callable, Tuple]:
        """ 데이터 생성자 고차함수입니다. """

        constituent_list = ("alcoholic_drinks", "drinks", "ingredients", "equipments")

        lorem, *constituents = pylist_reader("lorems", *constituent_list)
        constituents = {key: value for key, value in zip(constituent_list, constituents)}

        def description(x):
            return "\n".join(random.choice(lorem) for _ in range(2))

        def elements(container) -> Tuple[Callable]:
            """
            논리적으로 어긋나지 않도록 Seed를 도와준다.
            각 카테고리에 알맞게 값을 생성한다.

            스크랩된 데이터를 사용해서 값을 만든다.

            -술에 알콜이 기입될때는 10%확률로 오버프루프 도수를 기입해준다-
            """

            def name():
                """ container라는 ref가 있기 때문에 lambda로 만들면 안된다. """
                return random.choice(constituents[container])

            if container == "alcoholic_drinks":
                alcohol = lambda: random.choice((random.randint(1, 50),) * 9 + (random.randint(1, 97),))
            else:
                alcohol = lambda: None

            type_dict = {
                "alcoholic_drinks": Constituent.TYPE_LIQUID,
                "drinks": Constituent.TYPE_LIQUID,
                "ingredients": Constituent.TYPE_INGREDIENT,
                "equipments": Constituent.TYPE_EQUIPMENT,
            }

            def kind():
                """ alcoholic_drinks, drinks 두번쓰기 싫어서 그냥 뒤에 5글자 잘라서 구분하기로 함 """
                return type_dict[container]

            return name, kind, alcohol

        return description, elements, constituent_list
