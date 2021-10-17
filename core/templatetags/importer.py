from os import listdir, path
from django import template
from django.utils.html import mark_safe
from django.conf import settings

register = template.Library()

STATIC_DIR = settings.STATICFILES_DIRS[0]


@register.filter
def js_module_import(script_url):

    return mark_safe(f"<script src='{STATIC_DIR}/js/{script_url}'></script>")


@register.filter
def css_import(css_name):
    """css link html을 반환합니다"""
    return mark_safe(f"<link rel='stylesheet' href='{STATIC_DIR}/css/{css_name}'>")
