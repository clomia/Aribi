from django.urls import path
from users import views

app_name = "users"

urlpatterns = [
    path("login", views.LoginView.as_view(), name="login"),
    path("login/kakao", views.kakao_login, name="kakao-login"),
    path("login/kakao/callback", views.kakao_callback, name="kakao-callback"),
    path("login/github", views.github_login, name="github-login"),
    path("login/github/callback", views.github_callback, name="github-callback"),
    path("logout", views.log_out, name="logout"),
    path("signup", views.SignUpView.as_view(), name="signup"),
    path("detail/<int:pk>", views.user_detail, name="detail"),
    path("update-ajax", views.user_update_ajax, name="update"),
    path("update-profile-image", views.user_update_profile_image, name="update-profile-image"),
]
