const searchBoxForm = document.querySelector(".search-box__form")

const typeSearch = "search-box__type-search",
    typeTagSearch = "search-box__type-tag-search";

function searchType(clsName) {
    const ele = document.createElement('input');

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
