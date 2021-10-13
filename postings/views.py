from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from postings.models import Posting, Picture, PostingLike, Comment, CommentLike, Reply, ReplyLike
from users.models import User
from archives.models import Constituent, FlavorTag
from postings import forms
from postings.function import get_correlation_list


class LikeManager:
    """
    Ajax요청을 통한 Like조작 함수를 제공한다.

    Like조작이 필요한 객체는 Posting,Comment,Reply이다.
    """

    def __init__(self, _type: str, like_model, main_model):
        """_type = JS가 보내는 쿼리의 구분자:type"""

        self.type = _type
        self.pk_key = _type + "Pk"
        self.like_model = like_model
        self.main_model = main_model

    def init(self, pk: str, username):
        self.main_obj = self.main_model.objects.get(pk=int(pk))
        self.created_by = User.objects.get(username=username)
        self.like_model_kwargs = {
            "created_by": self.created_by,
            self.type: self.main_obj,
        }

    def add(self, post_request):
        """like 객체를 생성한다"""
        self.init(post_request.get(self.pk_key), post_request.get("username"))
        if not self.like_model.objects.filter(**self.like_model_kwargs):
            self.like_model.objects.create(**self.like_model_kwargs)
        return HttpResponse("true")

    def remove(self, post_request):
        """like 객체를 제거한다."""
        self.init(post_request.get(self.pk_key), post_request.get("username"))
        self.like_model.objects.filter(**self.like_model_kwargs).delete()
        return HttpResponse("true")


posting_like_manager = LikeManager("posting", PostingLike, Posting)
comment_like_manager = LikeManager("comment", CommentLike, Comment)
reply_like_manager = LikeManager("reply", ReplyLike, Reply)


def add_comment(post_request):
    posting = Posting.objects.get(pk=post_request.get("postingPk"))
    user = User.objects.get(username=post_request.get("username"))
    comment = Comment.objects.create(
        posting=posting,
        created_by=user,
        content=post_request.get("text"),
    )
    return HttpResponse(f"{user.name}&${user.profile_image.url}&${user.pk}&${comment.pk}")


ajax_update_func_map = {
    "postingLike": posting_like_manager.add,
    "removePostingLike": posting_like_manager.remove,
    "commentLike": comment_like_manager.add,
    "removeCommentLike": comment_like_manager.remove,
    "replyLike": reply_like_manager.add,
    "removeReplyLike": reply_like_manager.remove,
    "comment": add_comment,
}


def posting_update_ajax(request):
    # try:
    print(request.POST)
    if not request.POST.get("username"):
        return HttpResponse("")
    return ajax_update_func_map[request.POST.get("type")](request.POST)


# except:
#     print("[posting_update_ajax] ajax요청이 잘못되었습니다")
#     return HttpResponse("ajax요청이 잘못되었습니다")


def posting_detail(request, pk):
    """
    타겟 포스팅 객체, 그리고 타켓 포스팅과 연관성이 높은 포스팅들을 추출한다.
    """
    posting = Posting.objects.get(pk=pk)

    related_postings = [i[1] for i in get_correlation_list(posting)]
    return render(
        request,
        "page/posting-detail/main.html",
        context={
            "posting": posting,
            "related_postings": related_postings,
        },
    )


def get_archive_obj(data, *, model):
    """입력받은 데이터에 해당하는 archive 오브젝트들을 반환합니다."""

    result_list = []
    for i in data:
        try:
            obj = model.objects.get(pk=int(i))
            # get을 하기전에 int로 바꿀 수 없으면 여기로 온다
        except ValueError:
            if model == FlavorTag:
                obj = model.objects.get(expression=i)
            else:
                obj = model.objects.get(name=i)
        result_list.append(obj)
    return result_list


def posting_create_form(request):
    """
    포스팅 생성 패이지와 생성 기능을 담당하는 함수.

    POST요청이면 submit으로 간주하고 데이터를 입력받고 적용합니다.
    GET요청이면 create페이지를 렌더합니다.
    """

    p_get = lambda x: v if len(v := request.POST.getlist(x)) != 1 else v[0]
    # post 데이터가 없을때 (if request.GET:으로 하면 안됨!!)
    if not request.POST:
        if request.user.is_authenticated:
            form = forms.PostingCreateFrom
            return render(
                request,
                "page/posting-create/main.html",
                {
                    "form": form,
                },
            )
        else:
            return redirect(reverse("users:login"))
    else:
        user = User.objects.get(username=p_get("username"))
        cocktail_name = p_get("cocktail_name")
        content = p_get("content")
        constituents = get_archive_obj(p_get("constituents"), model=Constituent)
        flavor_tags = get_archive_obj(p_get("flavor_tags"), model=FlavorTag)

        created_posting = Posting.objects.create(
            created_by=user,
            cocktail_name=cocktail_name,
            content=content,
        )

        created_posting.constituents.set(constituents)
        created_posting.flavor_tags.set(flavor_tags)

        for i in request.FILES:
            Picture.objects.create(image=request.FILES[i], posting=created_posting)

        return redirect(reverse("postings:detail", kwargs={"pk": created_posting.pk}))
