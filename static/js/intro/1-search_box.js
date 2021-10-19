window.onbeforeunload = function () {
    // 페이지를 떠날때 로딩시간동안 로딩 애니메이션
    document.querySelector(".loading").classList.remove("none");
}

let searchBoxForm = document.querySelector(".search-box__form");
let tagSearchForm = document.querySelector(".tags[action='/search-result']");

let typeSearch = "search-box__type-search",
    typeTagSearch = "search-box__type-tag-search";

function searchType(clsName) {
    let ele = document.createElement('input');

    searchBoxForm.appendChild(ele)

    ele.className = clsName
    ele.type = "hidden"
    ele.name = "classifier"
    if (clsName === typeSearch) {
        ele.value = "search"
    } else if (clsName === typeTagSearch) {
        ele.value = "tag_search"
    }
}

searchType(typeSearch);


