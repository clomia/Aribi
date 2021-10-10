from django.shortcuts import render
from postings.models import Posting


def posting(request, pk):
    """타겟 포스팅 객체, 그리고 타켓 포스팅과 연관성이 높은 포스팅들을 추출한다."""
    posting = Posting.objects.get(pk=pk)

    created_by_ref = list(Posting.objects.filter(created_by__name__iregex=rf"{posting.created_by.name}"))
    constituents_ref, flavor_tags_ref = [], []
    for constituent in posting.constituents.all():
        constituents_ref.extend(list(Posting.objects.filter(constituents__name__iregex=rf"{constituent.name}")))
    for flavor_tag in posting.flavor_tags.all():
        flavor_tags_ref.extend(list(Posting.objects.filter(flavor_tags__expression__iregex=rf"{flavor_tag.expression}")))

    # 연관성이 높은 포스팅에서 타겟 포스팅 자신은 제외시킨다.
    ref_list = [i for i in (created_by_ref + constituents_ref + flavor_tags_ref) if i != posting]
    # 연관성이 높은 포스팅이 앞에오도록 정렬
    correlation_list = sorted(
        [(ref_list.count(posting), posting) for posting in set(ref_list)], key=lambda x: x[0], reverse=True
    )
    return render(
        request,
        "page/posting-detail/main.html",
        context={
            "posting": posting,
            "related_postings": [i[1] for i in correlation_list],
        },
    )
