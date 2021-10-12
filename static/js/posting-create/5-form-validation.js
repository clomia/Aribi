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

        if (!constituentsSelected.length) {
            reject("재료 태그가 선택되지 않았습니다!")
            return;
        }

        if (!flavorTagsSelected.length) {
            reject("맛 태그가 선택되지 않았습니다!");
            return;
        }

        // 모두 통과했다면
        form.submit()
    })
})