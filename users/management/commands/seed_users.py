import random
from itertools import cycle
from django.core.management.base import BaseCommand
from django_seed import Seed
from korean_name_generator import namer
from users.models import User


class Command(BaseCommand):
    def __init__(self, *args, **kwargs):
        """ 생성된 이름의 성별균형 , 성과 이름이 맞도록 하기 위한 오버라이딩입니다. """
        # * 이것이 잘 작동한다는것은 확인되었습니다.
        self.get_gender = cycle((True, False))
        self.name = None
        super().__init__(*args, **kwargs)

    help = "유저 데이터 생성"

    def add_arguments(self, parser):
        parser.add_argument("--total", help="How many books do you want to create?", default=10)

    def handle(self, *args, **options):

        total = int(options.get("total"))
        seeder = Seed.seeder()

        def username(x=None):
            """
            이름 + 숫자 (10%)
            이름 (30%)
            영어 단어 + 숫자 (10%)
            영어 이름 성 (30%)
            영어 이름 성 + 숫자 (20%)

            에서 하나를 셈플링합니다.

            셈플링된 값이 이미 있다면 다시 한번 더 셈플링 합니다.
            """
            if not self.name:
                self.name = namer.generate(next(self.get_gender))
            en_name = seeder.faker.first_name()
            en_word = seeder.faker.word()
            sample = (
                ((lambda: f"{self.name[1:]}{random.randint(0,10000)}")(),) * 1
                + (f"{self.name[1:]}",) * 3
                + ((lambda: f"{en_word}_{random.randint(0,10000)}")(),) * 1
                + (en_name,) * 3
                + ((lambda: f"{en_name}{random.randint(0,10000)}")(),) * 2
            )
            result = random.choice(sample)
            if (users := User.objects.all()) and not result in [user.username for user in users]:
                # 유저가 없는데 username확인하면 에러나기 때문에 유저가 있는지부터 확인하는 조건문
                return result
            else:
                username()

        def first_name(x):
            return self.name[0]

        def last_name(x):
            """ first_name 이후에 호출되어야 합니다! """
            name = self.name
            self.name = None
            return name[1:]

        seeder.add_entity(
            User,
            total,
            {
                "first_name": first_name,
                "username": username,
                "last_name": last_name,
                "login_method": lambda x: random.choice(User.LOGIN_METHODS),
            },
        )
        seeder.execute()
        self.stdout.write(self.style.SUCCESS(f"{total} users created!!"))
