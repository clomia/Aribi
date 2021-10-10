from django.shortcuts import render
from postings.models import Posting
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
