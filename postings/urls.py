from django.urls import path
from postings import views

app_name = "postings"

urlpatterns = [
    path("<int:pk>", views.posting_detail, name="detail"),
    path("create", views.posting_create_form, name="create"),
    path("edit/<int:pk>", views.posting_edit_form, name="edit"),
    path("update-ajax", views.posting_update_ajax, name="update"),
]
