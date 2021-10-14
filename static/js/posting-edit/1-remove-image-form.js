// image form이 없어도 문제가 없도록 한다.
const imageWrap = document.querySelector(".img-box-wrap")
const fakeNode = document.createElement("div");
const fakeNodeInner = document.createElement("div");
fakeNode.classList.add("img-box__mixin");
fakeNodeInner.classList.add("img-box__mixin__img");
fakeNodeInner.setAttribute("src", "true"); //콘솔로그에 404를 띄운다 무시해라
fakeNode.append(fakeNodeInner);
imageWrap.querySelector(".img-box").append(fakeNode)

