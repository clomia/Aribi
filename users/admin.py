from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from . import models


@admin.register(models.User)
class UserAdmin(UserAdmin):

    fieldsets = UserAdmin.fieldsets + (
        (
            "Profile Field",
            {
                "fields": (
                    "login_method",
                    "profile_image",
                    "bio",
                ),
            },
        ),
    )

    list_display = (
        "username",
        "login_method",
    )

    list_filter = ("login_method",)
