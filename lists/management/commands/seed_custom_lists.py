import random
from django.core.management.base import BaseCommand
from django_seed import Seed
from lists.models import CustomList
from users.models import User
from postings.models import Posting
from tools.lorem import pylist_loader


class Command(BaseCommand):

    help = "사용자 설정 리스트를 생성합니다"

    def add_arguments(self, parser):
        parser.add_argument(
            "--total",
            help="생성할 리스트의 갯수를 입력받습니다.",
            default=20,
        )

    def handle(self, *args, **options):
        total = int(options.get("total"))

        all_users = User.objects.all()
        all_postings = Posting.objects.all()

        seeder = Seed.seeder()
        seeder.add_entity(
            CustomList,
            total,
            {
                "name": self.list_name,
                "created_by": lambda x: random.choice(all_users),
            },
        )
        pk_list = seeder.execute()[CustomList]
        for pk in pk_list:
            custom_list = CustomList.objects.get(pk=pk)
            custom_list.postings.set(random.sample(tuple(all_postings), k=random.randint(1, len(all_postings))))
            self.stdout.write(self.style.SUCCESS(custom_list.name))

        self.stdout.write(self.style.SUCCESS(f"{total} CustomList created!"))

    def list_name(self, x):
        alcoholic_drinks, equipments, drinks, lorems = pylist_loader("alcoholic_drinks", "equipments", "drinks", "lorems")
        prefix = random.choice(lorems).split()[0]
        suffix = random.choice((random.choice(alcoholic_drinks), random.choice(equipments), random.choice(drinks)))
        name = prefix + suffix

        return name
