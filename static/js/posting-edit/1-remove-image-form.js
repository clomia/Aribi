window.onbeforeunload = function () {
    // 페이지를 떠날때 로딩시간동안 로딩 애니메이션
    document.querySelector(".loading").classList.remove("none");
}

// image form이 없어도 문제가 없도록 한다.
const imageWrap = document.querySelector(".img-box-wrap")
const fakeNode = document.createElement("div");
const fakeNodeInner = document.createElement("div");
fakeNode.classList.add("img-box__mixin");
fakeNodeInner.classList.add("img-box__mixin__img");
fakeNodeInner.setAttribute("src", "true");
fakeNode.append(fakeNodeInner);
imageWrap.querySelector(".img-box").append(fakeNode)

