from django import forms
from django.contrib.auth.forms import UserCreationForm
from users import models


class LoginForm(forms.Form):

    username = forms.CharField(label_suffix="", label="아이디")
    password = forms.CharField(widget=forms.PasswordInput, label_suffix="", label="비밀번호")

    def clean(self):

        username = self.cleaned_data.get("username")
        password = self.cleaned_data.get("password")

        try:
            user = models.User.objects.get(username=username)
            if user.check_password(password):
                return self.cleaned_data
            else:
                self.add_error("password", forms.ValidationError("비밀번호가 잘못되었습니다."))
        except models.User.DoesNotExist:
            self.add_error("username", forms.ValidationError("존재하지 않는 아이디입니다."))


class SignUpForm(UserCreationForm):

    username = forms.CharField(label_suffix="", label="아이디")
    password1 = forms.CharField(
        widget=forms.PasswordInput,
        label_suffix="",
        label="비밀번호",
    )
    password2 = forms.CharField(widget=forms.PasswordInput, label_suffix="", label="비밀번호 확인")

    class Meta:
        model = models.User
        fields = ("username",)

    def save(self, commit=True):
        """UserCreationForm의 save메소드를 복사-수정/오버라이딩 한것이다."""
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        user.name = self.cleaned_data["username"][:15]
        if commit:
            user.save()
        return user
