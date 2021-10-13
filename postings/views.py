from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from postings.models import Posting, Picture, PostingLike, Comment, CommentLike, Reply, ReplyLike
from users.models import User
from archives.models import Constituent, FlavorTag
from postings import forms
from postings.function import get_correlation_list


def posting_like(post_request):
    pk, username = post_request.get("postingPk"), post_request.get("username")
    posting = Posting.objects.get(pk=int(pk))
    created_by = User.objects.get(username=username)
    like_obj = PostingLike.objects.filter(created_by=created_by, posting=posting)
    if not like_obj:
        PostingLike.objects.create(created_by=created_by, posting=posting)
    return HttpResponse("true")


def remove_posting_like(post_request):
    pk, username = post_request.get("postingPk"), post_request.get("username")
    posting = Posting.objects.get(pk=int(pk))
    created_by = User.objects.get(username=username)
    like_obj = PostingLike.objects.filter(created_by=created_by, posting=posting)
    # 애초에 중복되는게 있으면 안되므로 쿼리셋 통으로 지운다.
    like_obj.delete()
    return HttpResponse("true")


def comment_like(post_request):
    pk, username = post_request.get("commentPk"), post_request.get("username")
    comment = Comment.objects.get(pk=int(pk))
    created_by = User.objects.get(username=username)
    like_obj = CommentLike.objects.filter(created_by=created_by, comment=comment)
    if not like_obj:
        CommentLike.objects.create(created_by=created_by, comment=comment)
    return HttpResponse("true")


def remove_comment_like(post_request):
    pk, username = post_request.get("commentPk"), post_request.get("username")
    comment = Comment.objects.get(pk=int(pk))
    created_by = User.objects.get(username=username)
    like_obj = CommentLike.objects.filter(created_by=created_by, comment=comment)
    # 애초에 중복되는게 있으면 안되므로 쿼리셋 통으로 지운다.
    like_obj.delete()
    return HttpResponse("true")


def reply_like(post_request):
    pk, username = post_request.get("replyPk"), post_request.get("username")
    reply = Reply.objects.get(pk=int(pk))
    created_by = User.objects.get(username=username)
    like_obj = ReplyLike.objects.filter(created_by=created_by, reply=reply)
    if not like_obj:
        ReplyLike.objects.create(created_by=created_by, reply=reply)
    return HttpResponse("true")


def remove_reply_like(post_request):
    pk, username = post_request.get("replyPk"), post_request.get("username")
    reply = Reply.objects.get(pk=int(pk))
    created_by = User.objects.get(username=username)
    like_obj = ReplyLike.objects.filter(created_by=created_by, reply=reply)
    # 애초에 중복되는게 있으면 안되므로 쿼리셋 통으로 지운다.
    like_obj.delete()
    return HttpResponse("true")


ajax_update_func_map = {
    "postingLike": posting_like,
    "removePostingLike": remove_posting_like,
    "commentLike": comment_like,
    "removeCommentLike": remove_comment_like,
    "replyLike": reply_like,
    "removeReplyLike": remove_reply_like,
}


def posting_update_ajax(request):
    # try:
    if not request.POST.get("username"):
        return HttpResponse("")
    return ajax_update_func_map[request.POST.get("type")](request.POST)


# except Exception as e:
#     print("[posting_update_ajax] ajax요청이 잘못되었습니다\n", e)
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
