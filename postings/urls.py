from django.urls import path
from postings import views

app_name = "postings"

urlpatterns = [
    path("<int:pk>", views.posting_detail, name="detail"),
    path("create", views.posting_create_form, name="create"),
]
