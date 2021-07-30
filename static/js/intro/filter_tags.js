// search box를 감지해서 동적으로 테그를 필터링한다.

const searchBox = document.querySelector('.search-box__input'),
    tagList = document.querySelectorAll(".tag"),
    tagboxField = document.querySelector(".tagbox__field");

// 유연한 검사: 태그와 텍스트를 해체해서 각 글자가 하나라도 대응하는지 검사
function flexibleValidation(input) {
    // 입력받는 텍스트중 한 글자라도 태그에 포함되어있는지 검사합니다
    // 포함된 경우 태그를 보여줍니다. 위치는 건드리지 않습니다.

    const inputData = input.toLowerCase().split("");

    function judgment(tag) {
        const tagData = tag.innerHTML.toLowerCase().split("");
        function isInclude() {
            return inputData.map(letter => tagData.includes(letter)).includes(true)
        }
        if (isInclude() || !inputData.length) {
            tag.classList.remove("none");
        } else {
            tag.classList.add("none");
        }
    }
    return judgment;
}
// 일반 검사: 태그에 텍스트가 포함되어있는지 검사
function Validation(input) {
    // 입력받는 텍스트가 태그에 포함되어있는지 검사합니다
    // 해당 태그들을 앞으로 이동시켜줍니다.

    const inputData = input.toLowerCase();

    function judgment(tag) {
        const tagData = tag.innerHTML.toLowerCase();
        function isInclude() {
            return tagData.includes(inputData);
        }
        if (isInclude()) {
            tagboxField.prepend(tag);
        }
    }
    return judgment;
}
// 경직된 검사: 완전 일치하는지 검사
function rigidValidation(input) {
    // 입력받는 텍스트가 태그와 정확히 일치하는지 검사합니다.
    // 해당 태그를 맨 앞으로 이동시켜줍니다.

    const inputData = input.toLowerCase();

    function judgment(tag) {
        const tagData = tag.innerHTML.toLowerCase();
        if (tagData === inputData) {
            tagboxField.insertBefore(tag, tagboxField.firstChild);
        }
        // 공백이 입력되어 초기화시킬때 뒤집힌 정렬을 모두 되돌려줍니다
        if (!inputData.length) {
            tagboxField.insertBefore(tag, null);
        }
    }
    return judgment;
}


function inputDetection(event) {
    tagList.forEach(flexibleValidation(event.target.value));
    tagList.forEach(Validation(event.target.value));
    tagList.forEach(rigidValidation(event.target.value));
}

searchBox.addEventListener("input", inputDetection);