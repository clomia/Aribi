from django.urls import path
from archives import views

app_name = "archives"

urlpatterns = [
    path("create", views.create_tag_ajax, name="create"),
]
