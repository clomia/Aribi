import random, os, time
from math import isinf
from django.core.management.base import BaseCommand
from django_seed import Seed
from numpy import average
from django.conf import settings
from postings.models import Posting, Picture, Comment, Reply, PostingLike, CommentLike, ReplyLike
from users.models import User
from archives.models import Constituent, FlavorTag
from tools.lorem import pylist_loader

MEDIA_ROOT = settings.MEDIA_ROOT


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
        print(f"유저 {all_users.count()}명")
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
                "alchol": lambda x: random.randint(1, 50),
            },
        )
        pk_list = seeder.execute()[Posting]

        # ---------------------
        self.counter = 0
        # ---------------------
        print("\n포스팅 생성을 시작합니다...\n")
        origin_start_time = int(time.time())
        for pk in pk_list:
            start_time = int(time.time())
            posting = Posting.objects.get(pk=pk)
            posting.constituents.set(random.sample(tuple(all_constituents), k=random.randint(2, 10)))
            posting.flavor_tags.set(random.sample(tuple(all_flavor_tags), k=random.randint(2, 10)))

            img_count = random.randint(1, 5)
            for _ in range(img_count):
                Picture.objects.create(
                    image=os.path.join(MEDIA_ROOT, f"postings/{random.randint(1,50)}.jpg"),
                    posting=posting,
                )
            self.stdout.write(self.style.SUCCESS(f"Posting[{posting.cocktail_name}]_Image({img_count})"))

            comment_count = random.randint(0, 14)
            comment_list, reply_list = [], []
            for _ in range(comment_count):
                comment_list.append(
                    comment := Comment.objects.create(
                        posting=posting,
                        created_by=random.choice(all_users),
                        content=self.comment_content(conversations, lorems),
                    )
                )

                reply_count = random.randint(0, 7)
                for _ in range(reply_count):
                    reply_list.append(
                        Reply.objects.create(
                            comment=comment,
                            created_by=random.choice(all_users),
                            content=self.comment_content(conversations, lorems),
                        )
                    )
            print(f"Comment({comment_count})", end=" , ")
            print(f"Reply({len(reply_list)})", end=" , ")
            all_users = User.objects.all()
            sample_users = lambda: random.sample(tuple(all_users), k=random.randint(0, len(all_users)))
            for user in (like_users := sample_users()):
                PostingLike.objects.create(posting=posting, created_by=user)
            print(f"Posting Like({len(like_users)})", end=" , ")
            comment_like_count = 0
            for comment in comment_list:
                for user in (like_users := sample_users()):
                    CommentLike.objects.create(comment=comment, created_by=user)
                    comment_like_count += 1
            print(f"Comment Like({comment_like_count})", end=" , ")
            reply_like_count = 0
            for reply in reply_list:
                for user in (like_users := sample_users()):
                    ReplyLike.objects.create(reply=reply, created_by=user)
                    reply_like_count += 1
            print(f"Reply Like({reply_like_count})")

            # * 남은 시간 계산해서 출력해주는 부분
            second = int(time.time()) - start_time
            self.counter += 1
            if not posting.cocktail_name:
                # 0.5%? 확률정도로 이름없는 객체가 생성된다 원인을 못찾아서 일단 여기서 처리한다.
                posting.delete()
                self.stdout.write(self.style.WARNING("잘못 생성된 객체를 제거하였습니다.\n"))
            else:
                self.stdout.write(self.style.SUCCESS(f"({self.counter}/{len(pk_list)})[{second}s]\n"))

        self.stdout.write(self.style.SUCCESS(f"{total} Postings created! , 걸린 시간: {int(time.time()-origin_start_time)}초"))

    def comment_content(self, conversations: list, lorems: list):
        """코멘트 글을 생성합니다."""

        sentence = random.choice(conversations)
        if random.randint(1, 3) == 1:
            # 확률 1/3
            return sentence
        else:
            return random.choice((" ", "\n")).join(random.sample(lorems, k=random.randint(1, 3))) + sentence
