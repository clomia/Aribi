window.onload = function () {
    const infoNode = document.querySelector(".posting-info");
    console.log(infoNode);
    const cocktailName = infoNode.querySelector(".posting-posting-info__cocktail-name").innerText.trim();
    const content = infoNode.querySelector(".posting-posting-info__content").innerText.trim();
    const constituentInfoNodes = infoNode.querySelectorAll(".posting-posting-info__constituents .posting-posting-info__constituents-name");
    const constituents = Array(...constituentInfoNodes).map(function (ele) {
        return ele.innerHTML.trim(); // 백엔드 태그 저장하기 전 strip 코드가 있기 때문에 보장되는 작업
    });
    const flavorTagInfoNodes = infoNode.querySelectorAll(".posting-posting-info__flavor-tags .posting-posting-info__flavor-tags-name");
    const flavorTags = Array(...flavorTagInfoNodes).map(function (ele) {
        return ele.innerHTML.trim(); // 백엔드에서 태그 저장하기 전 strip 코드가 있기 때문에 보장되는 작업
    });

    const form = document.querySelector(".box form");
    const nameForm = form.querySelector("input[name='cocktail_name']");
    const contentForm = form.querySelector("textarea[name='content']");

    nameForm.value = cocktailName
    contentForm.value = content
    contentForm.style.height = contentForm.scrollHeight + "px";

    const constituentsNodes = document.querySelectorAll(".tag-box__constituents__content__field .tag")
    const selectedConstituents = Array(...constituentsNodes).filter(function (ele) {
        return constituents.includes(ele.innerHTML.trim());
    })
    const flavorTagNodes = document.querySelectorAll(".tag-box__flavors__content__field .tag")
    const selectedFlavorTags = Array(...flavorTagNodes).filter(function (ele) {
        return flavorTags.includes(ele.innerHTML.trim());
    })

    selectedConstituents.forEach(function (ele) {
        ele.click()
    })

    selectedFlavorTags.forEach(function (ele) {
        ele.click()
    })
}