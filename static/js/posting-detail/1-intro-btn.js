const introBtn = document.querySelector(".intro-btn"),
    introBtnButton = document.querySelector(".intro-btn button");

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

const isMobile = detectMobileDevice(window.navigator.userAgent)

introBtn.addEventListener("mouseenter", function (event) {
    if (!isMobile) {
        introBtnButton.innerHTML = "Airibi 홈으로 이동"
    }
})

introBtn.addEventListener("mouseleave", function (event) {
    if (!isMobile) {
        introBtnButton.innerHTML = "Aribi"
    }
})