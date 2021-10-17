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

        // 이미지가 입력되었는가?
        const images = document.querySelectorAll(".img-box__mixin__img");
        const uploadImages = Array(...images).filter(function (image) {
            const src = image.getAttribute("src");
            return Boolean(src);
        })
        if (!uploadImages.length) {
            reject("선택된 이미지가 없습니다!");
            return;
        }

        // 맛태그,재료태그 모두 하나라도 선택되었는가?
        const flavorTagsSelected = document.querySelectorAll('input[name="flavor_tags"]:checked');
        const constituentsSelected = document.querySelectorAll('input[name="constituents"]:checked');

        if (constituentsSelected.length <= 2) {
            reject("재료 태그를 두개 이상 선택해주세요");
            return;
        }

        if (flavorTagsSelected.length <= 2) {
            reject("맛 태그를 두개 이상 선택해주세요");
            return;
        }

        // 모두 통과했다면
        form.submit()
    })
})