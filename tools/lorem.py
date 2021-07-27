""" 한국어 텍스트 데이터를 생성합니다 """

import pickle
from typing import List
from config.settings import BASE_DIR


def pylist_loader(*args: str) -> List[List]:
    """
    ! 반환값은 리스트 내포 리스트입니다. 하나의 값을 전했어도 인덱싱으로 꺼내야 합니다
    확장자를 제외한 파일명을 입력해주세요.

    여러개의 pylist파일을 읽어서 리스트로 반환합니다.
    pylist파일은 python list 타입을 직렬화한 파일입니다.

    데이터 은폐와 운영체재별 인코딩 문제를 방지하기 위해서
    직렬화 방식을 사용하였습니다.
    """
    file_objs = [open(BASE_DIR / f"tools/data/{name}.pylist", "rb") for name in args]
    data = [pickle.load(file) for file in file_objs]
    for file in file_objs:
        file.close()
    return data


"""
import random

with open("tools/data/lorem.pylist", "rb") as file:
    lst = pickle.load(file)
    print(random.choice(lst))
"""
