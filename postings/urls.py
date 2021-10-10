from django.urls import path
from . import views

app_name = "postings"

urlpatterns = [
    path("<int:pk>", views.posting, name="detail"),
]
