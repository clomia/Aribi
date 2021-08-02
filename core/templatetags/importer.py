from os import listdir, path
from django import template
from django.utils.html import mark_safe
from django.conf import settings

register = template.Library()

STATIC_DIR = settings.STATICFILES_DIRS[0]


@register.filter
def js_module_import(page_name):
    """
    js 모듈을 인자로 받으면 모듈 내 js파일들을 모두 불러오는 html을 반환합니다.

    js디렉토리 내에서 패이지와 대응되는 디렉토리 이름을 받는다.
    해당 디렉토리 내 모든 js파일을 불러오는 html 문자열을 반환한다.

    --예시--
    {% load importer %}
    {{ "intro"|js_module_import }}
    """
    js_module_list = listdir(f"{STATIC_DIR}/js/{page_name}")
    html_contents = []
    """ 
    path_expression = lambda js_module: path.join(STATIC_DIR, "js", page_name, js_module)
    STATIC_DIR를 사용한 절대경로는 브라우저에서 작동하지 않았다 그냥 static만 넣어준 상대경로는 작동하였다
    html에서 static태그를 사용한 경로도 상대경로로 렌더링되더라 페이지 소스보기로 확인해보았다.
    """

    for js_module in js_module_list:
        html_contents.append(f"\n<script src='/static/js/{page_name}/{js_module}'></script>")

    return mark_safe("".join(html_contents))


@register.filter
def css_import(css_name):
    """ css link html을 반환합니다 """
    return mark_safe(f"<link rel='stylesheet' href='/static/css/{css_name}'>")