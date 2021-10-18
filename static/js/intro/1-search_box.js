function detectMobileDevice(agent) {
    const mobileRegex = [
        /Android/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ]

    return mobileRegex.some(mobile => agent.match(mobile))
}

if (detectMobileDevice(window.navigator.userAgent)) {
    // 홈 화면 로딩효과는 앱을 사용하는 모바일에서만 적용
    window.addEventListener('load', function (event) {
        const loading = document.querySelector(".loading");
        loading.classList.add("none");
    })
} else {
    const loading = document.querySelector(".loading");
    loading.classList.add("none");
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
searchBoxForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const loading = document.querySelector(".loading");
    loading.classList.remove("none");
    searchBoxForm.submit();
})

searchType(typeSearch);
