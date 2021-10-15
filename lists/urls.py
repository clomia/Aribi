from django.urls import path
from lists import views

app_name = "lists"

urlpatterns = [
    path("update-ajax", views.list_update_ajax, name="update-ajax"),
]
