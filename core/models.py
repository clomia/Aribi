from datetime import datetime, timedelta
from pytz import timezone
from django.db import models


class CoreModel(models.Model):

    """모델의 생성시간과 수정시간이 기록되는 추상모델입니다."""

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def created_ago(self) -> str:
        """
        최소단위만 사용해서 1시간 전,1일 전,1주 전,1개월 전,1년 전
        으로 가공된 문자열을 반환합니다.
        """
        HOUR = (MINUTE := 60) * MINUTE

        now = datetime.now(timezone("Asia/Seoul")).timestamp()
        created = self.created.timestamp()
        delta = timedelta(seconds=now - created)
        if not delta.days:
            if hour := delta.seconds // HOUR:
                return f"{hour}시간 전"
            elif minute := delta.seconds // MINUTE:
                return f"{minute}분 전"
            else:
                return f"{delta.seconds}초 전"
        elif (YEAR := 365) > delta.days >= (MONTH := 30):
            month = delta.days // MONTH
            return f"{month}개월 전"
        elif delta.days > YEAR:
            year = delta.days // YEAR
            return f"{year}년 전"
        else:
            return f"{delta.days}일 전"

    class Meta:
        abstract = True
