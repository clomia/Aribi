function reject(message) {
    alert(message);
    scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
    })
}

window.addEventListener('load', function () {
    const form = document.querySelector(".box form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        //텍스트 입력은 html이 검사해줌
        const username = document.querySelector(".username-data");
        if (!username.value) {
            reject("로그인이 필요합니다.")
            return;
        }

        //
        const cocktail_name = form.querySelector('input[name="cocktail_name"]');
        const content = form.querySelector('textarea[name="content"]');
        if (!cocktail_name.value.trim().length) {
            reject("포스팅 타이틀을 공백으로 제출할 수 없습니다.");
            return;
        }

        if (!content.value.trim().length) {
            reject("본문을 공백으로 제출할 수 없습니다.");
            return;
        }

        // 이미지가 입력되었는가?
        const images = document.querySelectorAll(".img-box__mixin__img");
        const uploadImages = Array(...images).filter(function (image) {
            const src = image.getAttribute("src");
            return Boolean(src);
        })
        if (!uploadImages.length) {
            reject("선택된 이미지가 없습니다.");
            return;
        }

        const flavorTagsSelected = document.querySelectorAll('input[name="flavor_tags"]:checked');
        const constituentsSelected = document.querySelectorAll('input[name="constituents"]:checked');

        if (constituentsSelected.length === 0) {
            document.querySelector("#id_constituents_186").click();
        }

        if (flavorTagsSelected.length === 0) {
            document.querySelector("#id_flavor_tags_78").click();
        }
        // 아래 코드는 그대로 둔다.
        // 어차피 템플릿에 Loading은 하나고 class 삭제로 구현되어있어서
        // 중복 실행되도 문제 없다.
        // 아래의 코드가 이벤트 리스너보다 빠르기 때문.
        const loading = document.querySelector(".loading");
        loading.classList.remove("none");
        // 모두 통과했다면
        form.submit();
    })
})