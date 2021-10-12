function renderTag(ul, className) {
    // inputId로 input찾아서 click하면 checked 된다!
    for (let li of ul.querySelectorAll("li")) {
        let label = li.querySelector('label');
        let inputId = label.getAttribute("for");
        let text = label.innerText.trim();

        let div = document.createElement("div");
        div.classList.add("tag");
        div.classList.add(className);
        div.setAttribute("inputId", inputId);
        div.innerHTML = text;
        box = document.querySelector(`.tag-box__${className}__content__field`);
        box.appendChild(div);
    }
}

// search box를 감지해서 동적으로 테그를 필터링한다.
function tagFiltering(searchBox, tagList, tagField) {

    // 유연한 검사: 태그와 텍스트를 해체해서 각 글자가 하나라도 대응하는지 검사
    function flexibleValidation(input) {
        // 입력받는 텍스트중 한 글자라도 태그에 포함되어있는지 검사합니다
        // 포함된 경우 태그를 보여줍니다. 위치는 건드리지 않습니다.

        let inputData = input.toLowerCase().split("");

        function judgment(tag) {
            let tagData = tag.innerHTML.toLowerCase().split("");
            function isInclude() {
                return inputData.map(letter => tagData.includes(letter)).includes(true)
            }
            if (!Array(...tag.classList).includes("raise")) {
                if (isInclude() || !inputData.length) {
                    tag.classList.remove("none");
                } else {
                    tag.classList.add("none");
                }
            }
        }
        return judgment;
    }
    // 일반 검사: 태그에 텍스트가 포함되어있는지 검사
    function Validation(input) {
        // 입력받는 텍스트가 태그에 포함되어있는지 검사합니다
        // 해당 태그들을 앞으로 이동시켜줍니다.

        let inputData = input.toLowerCase();

        function judgment(tag) {
            if (!Array(...tag.classList).includes("raise")) {
                let tagData = tag.innerHTML.toLowerCase();
                function isInclude() {
                    return tagData.includes(inputData);
                }
                if (isInclude()) {
                    tagField.prepend(tag);
                }
            }
        }
        return judgment;
    }
    // 경직된 검사: 완전 일치하는지 검사
    function rigidValidation(input) {
        // 입력받는 텍스트가 태그와 정확히 일치하는지 검사합니다.
        // 해당 태그를 맨 앞으로 이동시켜줍니다.

        let inputData = input.toLowerCase();

        function judgment(tag) {
            if (!Array(...tag.classList).includes("raise")) {
                let tagData = tag.innerHTML.toLowerCase();
                if (tagData === inputData) {
                    tagField.insertBefore(tag, tagField.firstChild);
                }
                // 공백이 입력되어 초기화시킬때 뒤집힌 정렬을 모두 되돌려줍니다
                if (!inputData.length) {
                    tagField.insertBefore(tag, null);
                }
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
}

function clickTag(tagList, selectedField) {
    for (let tag of tagList) {
        tag.addEventListener("click", function () {
            const selectedTag = tag.cloneNode(true);
            tag.classList.add("none");
            selectedTag.classList.add("selectedTag");

            selectedField.insertBefore(selectedTag, selectedField.firstChild);
            document.getElementById(tag.getAttribute("inputid")).click()

            selectedTag.addEventListener("click", function (event) {
                document.getElementById(tag.getAttribute("inputid")).click()
                selectedTag.remove();
                tag.classList.remove("none");
            })
        })
    }
}

function selectedWrapScaler(selected, wrapper) {
    let observer = new MutationObserver((mutations) => {
        wrapper.style.height = `${selected.clientHeight}px`;
    })
    observer.observe(selected, { childList: true });
}

function helpText(selected, text) {
    let observer = new MutationObserver((mutations) => {
        if (selected.childElementCount) {
            text.classList.add("none");
        } else {
            text.classList.remove("none");
        }
    })
    observer.observe(selected, { childList: true });
}


window.addEventListener('load', function () {
    const constituents = document.querySelector("#id_constituents"),
        flavors = document.querySelector("#id_flavor_tags");

    renderTag(constituents, "constituents");
    renderTag(flavors, "flavors");

    const constituentInput = document.querySelector(".tag-box__constituents__search-box input");
    const flavorInput = document.querySelector(".tag-box__flavors__search-box input");

    const constituentsField = document.querySelector(".tag-box__constituents__content__field");
    const flavorsField = document.querySelector(".tag-box__flavors__content__field");

    const constituentTags = document.querySelectorAll(".tag-box__constituents__content__field .tag");
    const flavorTags = document.querySelectorAll(".tag-box__flavors__content__field .tag");

    tagFiltering(constituentInput, constituentTags, constituentsField);
    tagFiltering(flavorInput, flavorTags, flavorsField);

    const constituentsSelectedWrap = document.querySelector(".tag-box__constituents__selected");
    const constituentsSelected = document.querySelector(".tag-box__constituents__selected__field");
    const flavorsSelectedWrap = document.querySelector(".tag-box__flavors__selected");
    const flavorsSelected = document.querySelector(".tag-box__flavors__selected__field");

    clickTag(constituentTags, constituentsSelected);
    clickTag(flavorTags, flavorsSelected);

    selectedWrapScaler(constituentsSelected, constituentsSelectedWrap);
    selectedWrapScaler(flavorsSelected, flavorsSelectedWrap);

    const constituentsHelpText = document.querySelector(".tag-box__constituents__help-text");
    const flavorsHelpText = document.querySelector(".tag-box__flavors__help-text");

    helpText(constituentsSelected, constituentsHelpText);
    helpText(flavorsSelected, flavorsHelpText);
})