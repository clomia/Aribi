from django.urls import path
from core.views import Intro

app_name = "core"

urlpatterns = [
    path("", Intro.main, name="home"),
    path("search-result/", Intro.search_progress, name="search_progress"),
]