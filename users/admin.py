from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from users import models


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
        "name",
        "login_method",
        "created",
        "username",
    )

    list_filter = ("login_method",)

    search_fields = (
        "name",
        "bio",
    )
