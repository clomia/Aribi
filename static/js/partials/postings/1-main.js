let postings = Array(...document.querySelectorAll(".posting"));
let pkList = postings.map(ele => ele.classList[0]);
let set = new Set(pkList);
pkList = [...set];

function getPk(ele) {
    if (!isNaN(ele.classList[0])) {
        return ele.classList[0];
    } else {
        console.log("[Error| getPk ] pk가 없는 앨리먼트 입니다")
    }
}


for (let index in postings) {
    let posting = postings[index];
    //* x1
    // 메뉴버튼 출렁거리기
    let menuBtn = posting.querySelector(".posting__x1__menu-btn"),
        dot1 = posting.querySelector(".c1"),
        dot2 = posting.querySelector(".c2"),
        dot3 = posting.querySelector(".c3");
    menuBtn.addEventListener("mouseenter",
        function (event) {
            dot1.classList.add("c1-bounce");
            dot2.classList.add("c2-bounce");
            dot3.classList.add("c3-bounce");
        }
    )
    menuBtn.addEventListener("mouseleave",
        function (event) {
            dot1.classList.remove("c1-bounce");
            dot2.classList.remove("c2-bounce");
            dot3.classList.remove("c3-bounce");
        }
    )
    // 메뉴 나타나기
    let menu = posting.querySelector(".posting__x1__menu-btn__box")
    menu.classList.add("none");
    menuBtn.addEventListener("click", function (event) {
        if (Array(...menu.classList).includes("none")) {
            console.log("none없앰")
            menu.classList.remove("none");
        } else {
            menu.classList.add("none");
        }
    })

    // x2
    let images = posting.querySelectorAll(".posting__x2__img");
    images.forEach(ele => ele.classList.add("none"));
    images[0].classList.remove("none");
}





function* generator() {
    let threshold = images.length;
    let index = -1;
    while (index < threshold) {
        yield index++;
        if (index === threshold - 1) {
            index = -1;
        }
    }
}