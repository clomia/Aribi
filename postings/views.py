from django.shortcuts import render
from postings.models import Posting
from postings import forms
from postings.function import get_correlation_list


def posting(request, pk):
    """타겟 포스팅 객체, 그리고 타켓 포스팅과 연관성이 높은 포스팅들을 추출한다."""
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


def posting_create_form(request):
    if not request.POST:
        form = forms.PostingCreate
        return render(
            request,
            "page/posting-create/main.html",
            {
                "form": form,
            },
        )
    else:
        # print(request.POST, request, dir(request), request.GET)
        print(request.FILES, request.COOKIES, request.session, request.parse_file_upload, request.upload_handlers)
        print(imag := request.POST["image"], type(imag))
        #! 포스팅 생성 후 pk로 url 구해서 거기로 reverse, redirect
