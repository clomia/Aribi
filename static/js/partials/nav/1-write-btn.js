const writeBtnText = document.querySelector(".nav__write-button__text"),
    writeBtn = document.querySelector(".nav__write-button");

//모바일 미적용

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


writeBtn.addEventListener("mouseenter", function (event) {
    if (!detectMobileDevice(window.navigator.userAgent)) {
        writeBtnText.innerHTML = "포스팅 작성하기"
    }
})

writeBtn.addEventListener("mouseleave", function (event) {
    if (!detectMobileDevice(window.navigator.userAgent)) {
        writeBtnText.innerHTML = ""
    }
})