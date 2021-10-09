import os, requests
from django.views.generic import FormView
from django.urls import reverse_lazy
from django.shortcuts import render, redirect, reverse
from django.contrib.auth import authenticate, login, logout
from . import forms, models


redirect_uri = lambda x: f"http://127.0.0.1:8000/users/login/{x}/callback"
social = {
    "kakao": {
        "key": os.environ.get("KAKAO_REST_API_KEY"),
        "redirect_uri": redirect_uri("kakao"),
    },
    "github": {
        "id": os.environ.get("GITHUB_ID"),
        "secret": os.environ.get("GITHUB_SECRET"),
        "redirect_uri": redirect_uri("github"),
    },
}
social_username = lambda method, _id: method + str(_id)


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


# ------------  Kakao  ----------------
class KakaoException(Exception):
    pass


def kakao_login(request):

    return redirect(
        "https://kauth.kakao.com/oauth/authorize"
        + f"?client_id={social['kakao']['key']}"
        + f"&redirect_uri={social['kakao']['redirect_uri']}"
        + f"&response_type=code"
    )


def kakao_callback(request):
    try:
        code = request.GET.get("code")
        token_request = requests.get(
            "https://kauth.kakao.com/oauth/token"
            + "?grant_type=authorization_code"
            + f"&client_id={social['kakao']['key']}"
            + f"&redirect_uri={social['kakao']['redirect_uri']}"
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
        user_id = profile_json.get("id")
        # AttributeError -> 'NoneType' object has no attribute 'get'
        kakao_name = profile_json.get("properties").get("nickname")
        username = social_username(models.User.LOGIN_KAKAO, user_id)
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

    except (KakaoException, AttributeError):
        return redirect(reverse("users:login"))


# ------------  Github  ----------------
class GithubException(Exception):
    pass


def github_login(request):
    return redirect(
        "https://github.com/login/oauth/authorize"
        + f"?client_id={social['github']['id']}"
        + f"&redirect_uri={social['github']['redirect_uri']}"
        + "&scope=read:user"
    )


def github_callback(request):
    try:
        client_id = social["github"]["id"]
        client_secret = social["github"]["secret"]
        if code := request.GET.get("code", None):
            result = requests.post(
                "https://github.com/login/oauth/access_token"
                + f"?client_id={client_id}"
                + f"&client_secret={client_secret}"
                + f"&code={code}",
                headers={"Accept": "application/json"},
            )
            if (result_json := result.json()).get("error", None):
                raise GithubException()
            else:
                access_token = result_json.get("access_token")
                api_request = requests.get(
                    "https://api.github.com/user",
                    headers={
                        "Authorization": f"token {access_token}",
                        "Accept": "application/json",
                    },
                )
                profile_json = api_request.json()
                if not (github_name := profile_json.get("login", None)):
                    raise GithubException()

                user_id = profile_json.get("id")
                username = social_username(models.User.LOGIN_GITHUB, user_id)
                try:
                    user = models.User.objects.get(username=username)
                except models.User.DoesNotExist:
                    user = models.User.objects.create(
                        name=github_name,
                        username=username,
                        login_method=models.User.LOGING_GITHUB,
                    )
                    user.set_unusable_password()
                    user.save()
                login(request, user)
                # * SUCCESS
                return redirect(reverse("core:intro"))
        else:
            raise GithubException()
    except GithubException:
        return redirect(reverse("users:login"))
