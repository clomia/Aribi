import random, os
from typing import Callable
from django.core.management.base import BaseCommand
from django_seed import Seed
from config.settings import MEDIA_ROOT
from postings.models import Posting, Picture, Comment, Reply, Like
from users.models import User
from archives.models import Constituent, FlavorTag
from tools.lorem import pylist_loader


class Command(BaseCommand):

    help = "포스팅을 생성합니다."

    def add_arguments(self, parser):
        parser.add_argument(
            "--total",
            help="생성할 포스팅의 갯수를 입력받습니다.",
            default=20,
        )

    def handle(self, *args, **options):
        total = int(options.get("total"))
        all_users = User.objects.all()
        all_constituents = Constituent.objects.all()
        all_flavor_tags = FlavorTag.objects.all()
        cocktail_names, lorems, conversations = pylist_loader("cocktails", "lorems", "conversations")

        seeder = Seed.seeder()
        seeder.add_entity(
            Posting,
            total,
            {
                "created_by": lambda x: random.choice(all_users),
                "cocktail_name": lambda x: random.choice(cocktail_names),
                "content": lambda x: "\n".join(random.sample(lorems, k=random.randint(1, 7))),
            },
        )
        pk_list = seeder.execute()[Posting]

        self.counter = 0
        for pk in pk_list:
            posting = Posting.objects.get(pk=pk)
            posting.constituents.set(random.sample(tuple(all_constituents), k=random.randint(2, 10)))
            posting.flavor_tags.set(random.sample(tuple(all_flavor_tags), k=random.randint(2, 10)))

            img_count = random.randint(1, 5)
            for _ in range(img_count):
                Picture.objects.create(
                    image=os.path.join(MEDIA_ROOT, f"postings/{random.randint(1,50)}.jpg"),
                    posting=posting,
                )

            comment_count = random.randint(0, 14)
            for _ in range(comment_count):
                comment = Comment.objects.create(
                    posting=posting,
                    created_by=random.choice(all_users),
                    photo=self.comment_photo(),
                    score=random.randint(1, 5),
                    content=self.comment_content(conversations, lorems),
                )

                reply_count = random.randint(0, 7)
                for _ in range(reply_count):
                    Reply.objects.create(
                        comment=comment,
                        created_by=random.choice(all_users),
                        photo=self.comment_photo(),
                        content=self.comment_content(conversations, lorems),
                    )
            all_users = User.objects.all()
            like_users = random.sample(tuple(all_users), k=random.randint(0, len(all_users)))
            for user in like_users:
                Like.objects.create(posting=posting, created_by=user)

            if not posting.cocktail_name:
                # 0.5%? 확률정도로 이름없는 객체가 생성된다 원인을 못찾아서 일단 여기서 처리한다.
                posting.delete()
                self.stdout.write(self.style.WARNING("잘못 생성된 객체를 제거하였습니다."))
            else:
                self.counter += 1

                self.stdout.write(
                    self.style.SUCCESS(
                        f"({self.counter}/{len(pk_list)}) | {posting} | picture:{img_count} like:{len(like_users)} comment:{comment_count} and replies"
                    )
                )

        self.stdout.write(self.style.SUCCESS(f"{total} Postings created!"))

    def comment_content(self, conversations: list, lorems: list):
        """ 코멘트 글을 생성합니다. """

        sentence = random.choice(conversations)
        if random.randint(1, 3) == 1:
            # 확률 1/3
            return sentence
        else:
            return random.choice((" ", "\n")).join(random.sample(lorems, k=random.randint(1, 3))) + sentence

    def comment_photo(self):
        """ 20% 확률로 사진을 반환한다. 사진이 아닐경우 None이다. """
        photo = os.path.join(MEDIA_ROOT, f"comment_images/{random.randint(1,50)}.jpg")
        return random.choice((photo,) + (None,) * 4)
