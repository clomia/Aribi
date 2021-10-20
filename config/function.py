from textwrap import dedent
from django.http import HttpResponse


def robots_txt(request):
    """
    robots.txt를 제공한다

    robots.txt는 검색로봇에게 사이트 및 웹페이지를 수집할 수 있도록 허용하거나 제한하는 국제 권고안입니다.
    robots.txt파일은 반드시 사이트의 루트 디렉터리에 위치해야 하며 텍스트 파일 (text/plain) 로 접근이 가능해야 합니다.
    """
    txt = dedent(
        """
        User-agent: *
        Allow:/
    """
    )
    return HttpResponse(txt)
