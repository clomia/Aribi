const sortBtn = document.querySelector(".sort-btn"),
    sortBtnButton = document.querySelector(".sort-btn button"),
    latestPostings = document.querySelector(".postings-section__latest"),
    popularityPostings = document.querySelector(".postings-section__popularity");

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

//전역에 const 쓰지 마라 js 스크립트 막 합쳐지는데 나중에 곤란해진다
let isMobile = detectMobileDevice(window.navigator.userAgent)

sortBtn.addEventListener("click", function (event) {
    if (sortBtn.classList.contains("latest")) {
        // 최신순 정렬
        sortBtn.classList.add("popularity");
        sortBtn.classList.remove("latest");
        latestPostings.classList.add("none");
        popularityPostings.classList.remove("none");
        sortBtnButton.innerHTML = "인기 포스팅"
    } else {
        // 인기순 정렬
        sortBtn.classList.remove("popularity");
        sortBtn.classList.add("latest");
        latestPostings.classList.remove("none");
        popularityPostings.classList.add("none");
        sortBtnButton.innerHTML = "최신 포스팅"
    }
})

sortBtn.addEventListener("mouseenter", function (event) {
    if (!isMobile) {
        if (sortBtn.classList.contains("latest")) {
            // 최신순 정렬
            sortBtnButton.innerHTML = "인기 포스팅 보기"
        } else {
            // 인기순 정렬
            sortBtnButton.innerHTML = "최신 포스팅 보기"
        }
    }
})

sortBtn.addEventListener("mouseleave", function (event) {
    if (!isMobile) {
        if (sortBtn.classList.contains("latest")) {
            // 최신순 정렬
            sortBtnButton.innerHTML = "최신 포스팅"
        } else {
            // 인기순 정렬
            sortBtnButton.innerHTML = "인기 포스팅"
        }
    }
})