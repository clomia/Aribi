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


class CommentObjManager:
    def __init__(self, comment_model, target_model, comment_obj_name: str, target_name: str):
        self.comment_model = comment_model
        self.target_model = target_model
        self.comment_obj_name = comment_obj_name
        self.target_name = target_name

    def create(self, post_request):
        content = post_request.get("text")
        target_pk = int(post_request.get(self.target_name + "Pk"))

        target_obj = self.target_model.objects.get(pk=target_pk)
        user = User.objects.get(username=post_request.get("username"))
        comment_obj = self.comment_model.objects.create(
            **{
                self.target_name: target_obj,
                "created_by": user,
                "content": content,
            }
        )
        ajax_response = f"{user.name}&${user.profile_image.url}&${user.pk}&${comment_obj.pk}"
        return HttpResponse(ajax_response if self.target_name == "posting" else ajax_response + f"&${target_obj.pk}")

    def remove(self, post_request):
        comment_obj_pk = post_request.get(self.comment_obj_name + "Pk")
        comment_obj = self.comment_model.objects.get(pk=comment_obj_pk)
        user = User.objects.get(username=post_request.get("username"))
        if comment_obj.created_by == user:
            comment_obj.delete()
            return HttpResponse("true")
        else:
            return HttpResponse("")


posting_like_manager = LikeManager("posting", PostingLike, Posting)
comment_like_manager = LikeManager("comment", CommentLike, Comment)
reply_like_manager = LikeManager("reply", ReplyLike, Reply)

comment_manager = CommentObjManager(Comment, Posting, "comment", "posting")
reply_manager = CommentObjManager(Reply, Comment, "reply", "comment")


def remove_posting(post_request):
    posting = Posting.objects.get(pk=post_request.get("postingPk"))
    user = User.objects.get(username=post_request.get("username"))
    if posting.created_by == user:
        posting.delete()
        return HttpResponse("true")
    else:
        return HttpResponse("")


ajax_update_func_map = {
    "postingLike": posting_like_manager.add,
    "removePostingLike": posting_like_manager.remove,
    "commentLike": comment_like_manager.add,
    "removeCommentLike": comment_like_manager.remove,
    "replyLike": reply_like_manager.add,
    "removeReplyLike": reply_like_manager.remove,
    "comment": comment_manager.create,
    "removeComment": comment_manager.remove,
    "reply": reply_manager.create,
    "removeReply": reply_manager.remove,
    "removePosting": remove_posting,
}


def posting_update_ajax(request):
    try:
        if not request.POST.get("username"):
            return HttpResponse("")
        return ajax_update_func_map[request.POST.get("type")](request.POST)
    except:
        print("[posting_update_ajax]함수에서 예외 발생")
        return HttpResponse("")


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


def posting_edit_form(request, pk):
    p_get = lambda x: v if len(v := request.POST.getlist(x)) != 1 else v[0]
    # post 데이터가 없을때 (if request.GET:으로 하면 안됨!!)
    if not request.POST:
        if request.user.is_authenticated:
            form = forms.PostingCreateFrom
            posting = Posting.objects.get(pk=pk)
            return render(
                request,
                "page/posting-edit/main.html",
                {
                    "form": form,
                    "posting": posting,
                },
            )
        else:
            return redirect(reverse("users:login"))
    else:
        posting_pk = p_get("postingPk")
        user = User.objects.get(username=p_get("username"))
        constituents = get_archive_obj(p_get("constituents"), model=Constituent)
        flavor_tags = get_archive_obj(p_get("flavor_tags"), model=FlavorTag)

        # Replace section
        if (target_posting := Posting.objects.get(pk=posting_pk)).created_by == user:
            target_posting.cocktail_name = p_get("cocktail_name")
            target_posting.content = p_get("content")
            # replace ManyToMany
            target_posting.constituents.clear()
            target_posting.flavor_tags.clear()
            target_posting.constituents.set(constituents)
            target_posting.flavor_tags.set(flavor_tags)
            target_posting.save()

        return redirect(reverse("postings:detail", kwargs={"pk": posting_pk}))
