from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from . import models


@admin.register(models.User)
class UserAdmin(UserAdmin):

    fieldsets = (
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
    ) + UserAdmin.fieldsets

    list_display = (
        "username",
        "login_method",
        "created",
    )

    list_filter = ("login_method",)