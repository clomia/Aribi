window.scrollTo({ top: 0, behavior: 'smooth' });

window.onbeforeunload = function () {
    // 페이지를 떠날때 로딩시간동안 로딩 애니메이션
    document.querySelector(".loading").classList.remove("none");
}