from django.http import HttpResponse
from postings.models import Posting
from lists.models import CustomList
from users.models import User


def add_list(post_request):
    user = User.objects.get(username=post_request.get("username"))
    posting = Posting.objects.get(pk=int(post_request.get("postingPk")))
    target_lists = CustomList.objects.filter(created_by=user)
    if not target_lists:
        target_list = CustomList.objects.create(created_by=user, name=user.username)
    else:
        target_list, *_ = target_lists

    target_list.postings.add(posting)

    return HttpResponse("true")


def remove_list(post_request):
    user = User.objects.get(username=post_request.get("username"))
    posting = Posting.objects.get(pk=int(post_request.get("postingPk")))
    target_list, *_ = CustomList.objects.filter(created_by=user)
    target_list.postings.remove(posting)

    return HttpResponse("true")


ajax_update_func_map = {
    "addList": add_list,
    "removeList": remove_list,
}


def list_update_ajax(request):
    # try:
    if not request.POST.get("username"):
        return HttpResponse("")
    return ajax_update_func_map[request.POST.get("type")](request.POST)


# except:
#     print("[list_update_ajax]함수에서 예외 발생")
#     return HttpResponse("")
