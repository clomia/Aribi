from django.shortcuts import render, redirect
from django.urls import reverse
from postings.models import Posting, Picture
from users.models import User
from archives.models import Constituent, FlavorTag
from postings import forms
from postings.function import get_correlation_list


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
