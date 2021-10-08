import os, requests
from django.views.generic import FormView
from django.urls import reverse_lazy
from django.shortcuts import render, redirect, reverse
from django.contrib.auth import authenticate, login, logout
from . import forms, models

REST_API_KEY = os.environ.get("KAKAO_REST_API_KEY")
REDIRECT_URI = "http://127.0.0.1:8000/users/login/kakao/callback"


class LoginView(FormView):

    template_name = "page-to-url/users/login.html"
    form_class = forms.LoginForm
    success_url = reverse_lazy("core:intro")

    def form_valid(self, form):
        username = form.cleaned_data.get("username")
        password = form.cleaned_data.get("password")
        user = authenticate(self.request, username=username, password=password)
        if user:
            login(self.request, user)
        return super().form_valid(form)


def log_out(request):
    logout(request)
    return redirect(reverse("core:intro"))


class SignUpView(FormView):

    template_name = "page-to-url/users/signup.html"
    form_class = forms.SignUpForm
    success_url = reverse_lazy("core:intro")

    def form_valid(self, form):

        form.save()
        username = form.cleaned_data.get("username")
        password = form.cleaned_data.get("password1")  #!UserCreationForm의 코드를 따른다

        user = authenticate(self.request, username=username, password=password)
        # 해당 유저가 이미 있다면 로그인!
        print(user)
        if user:
            login(self.request, user)

        return super().form_valid(form)


def kakao_login(request):

    return redirect(
        f"https://kauth.kakao.com/oauth/authorize?client_id={REST_API_KEY}&redirect_uri={REDIRECT_URI}&response_type=code"
    )


class KakaoException(Exception):
    pass


def kakao_callback(request):
    try:
        code = request.GET.get("code")
        token_request = requests.get(
            "https://kauth.kakao.com/oauth/token?grant_type=authorization_code"
            + f"&client_id={REST_API_KEY}"
            + f"&redirect_uri={REDIRECT_URI}"
            + f"&code={code}"
        )
        token_json = token_request.json()
        if token_json.get("error", None):
            raise KakaoException

        access_token = token_json.get("access_token")
        profile_request = requests.get(
            "https://kapi.kakao.com/v2/user/me", headers={"Authorization": f"Bearer {access_token}"}
        )
        profile_json = profile_request.json()
        kakao_id = profile_json.get("id")
        kakao_name = profile_json.get("properties").get("nickname")
        username = models.User.LOGING_KAKAO + str(kakao_id)  #! 소셜 로그인시 user_id 생성 규칙
        try:
            user = models.User.objects.get(username=username)
        except models.User.DoesNotExist:
            user = models.User.objects.create(
                name=kakao_name,
                username=username,
                login_method=models.User.LOGING_KAKAO,
            )
            user.set_unusable_password()
            user.save()

        login(request, user)
        return redirect(reverse("core:intro"))

    # AttributeError -> 'NoneType' object has no attribute 'get'
    except (KakaoException, AttributeError):
        return redirect(reverse("users:login"))


def naver_login(request):

    return redirect(
        f"https://kauth.kakao.com/oauth/authorize?client_id={REST_API_KEY}&redirect_uri={REDIRECT_URI}&response_type=code"
    )


class NaverException(Exception):
    pass


def naver_callback(request):
    pass
