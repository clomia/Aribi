from django.urls import path
from core.views import Intro

app_name = "core"

urlpatterns = [
    path("", Intro.main, name="home"),
    path("intro-posting-getter", Intro.posting_loader, name="Ajax-intro"),  # name 뭘로하지? 사용하게 될때 수정해!!
    path("search-result/", Intro.search_progress, name="search_progress"),
]
