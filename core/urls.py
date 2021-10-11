from django.urls import path
from core.views import Intro

app_name = "core"

urlpatterns = [
    path("", Intro.main, name="intro"),
    path("intro-posting-getter", Intro.posting_loader, name="intro-posting-getter"),
    path("search-result", Intro.search_progress, name="search_progress"),
]
