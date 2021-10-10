from typing import Tuple, List
from postings.models import Posting


def get_correlation_list(posting) -> List[Tuple[int, object]]:
    """
    posting객체를 받아서 해당 posting과 연관성을 가지는 posting들을 반환합니다.
    연관성이 높은것을 먼저 오도록 정렬하여 리스트로 반환합니다.
    리스트 요소는 (연관도,포스팅) 이며 연관도는 정수입니다.
    """
    created_by_ref = list(Posting.objects.filter(created_by__name__iregex=rf"{posting.created_by.name}"))
    constituents_ref, flavor_tags_ref = [], []
    for constituent in posting.constituents.all():
        constituents_ref.extend(list(Posting.objects.filter(constituents__name__iregex=rf"{constituent.name}")))
    for flavor_tag in posting.flavor_tags.all():
        flavor_tags_ref.extend(list(Posting.objects.filter(flavor_tags__expression__iregex=rf"{flavor_tag.expression}")))

    # 연관성이 높은 포스팅에서 타겟 포스팅 자신은 제외시킨다.
    ref_list = [i for i in (created_by_ref + constituents_ref + flavor_tags_ref) if i != posting]
    # 연관성이 높은 포스팅이 앞에오도록 정렬
    return sorted([(ref_list.count(posting), posting) for posting in set(ref_list)], key=lambda x: x[0], reverse=True)
