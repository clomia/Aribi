let postings = Array(...document.querySelectorAll(".posting"));
let pkList = postings.map(ele => ele.classList[0]);
let set = new Set(pkList);
pkList = [...set];

console.log(pkList)

function getPk(ele) {
    if (!isNaN(ele.classList[0])) {
        return ele.classList[0];
    } else {
        console.log("[Error| getPk ] pk가 없는 앨리먼트 입니다")
    }
}


for (const index in postings) {
    const posting = postings[index];
    // x1
    let menuBtn = posting.querySelector(".posting__x1__menu");

    // x2
    let images = posting.querySelectorAll(".posting__x2__img");
    images.forEach(ele => ele.classList.add("none"));
    images[0].classList.remove("none");
}





function* foo() {
    let threshold = images.length;
    let index = -1;
    while (index < threshold) {
        yield index++;
        if (index === threshold - 1) {
            index = -1;
        }
    }
}