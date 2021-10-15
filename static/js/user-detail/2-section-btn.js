const listSection = document.querySelector(".list-section");
const postingSection = document.querySelector(".posting-section");
const sectionBtn = document.querySelector(".section-btn");
const nameNode = document.querySelector(".profile-section__info__name")
let nameString = nameNode.innerHTML.trim();


// observer = new MutationObserver(function (mutationsList, observer) {
//     console.log(mutationsList);
// });
// observer.observe(nameNode, { characterData: true, childList: true });


sectionBtn.addEventListener("mouseenter", function (event) {
    if (sectionBtn.getAttribute("state") === "posting") {
        sectionBtn.innerHTML = `${nameString}의 리스트 보기`;
    } else {
        sectionBtn.innerHTML = `${nameString}의 리스트 보기`;
    }
})

sectionBtn.addEventListener("mouseleave", function (event) {
    if (sectionBtn.getAttribute("state") === "posting") {
        sectionBtn.innerHTML = `${nameString}의 게시물`;
    } else {
        sectionBtn.innerHTML = `${nameString}의 리스트`;
    }
})

sectionBtn.addEventListener("click", function (event) {
    if (sectionBtn.getAttribute("state") === "posting") {
        sectionBtn.setAttribute("state", "list");
        sectionBtn.innerHTML = `${nameString}의 리스트`;
        listSection.classList.remove("none");
        postingSection.classList.add("none");
    } else {
        sectionBtn.setAttribute("state", "posting");
        sectionBtn.innerHTML = `${nameString}의 게시물`;
        postingSection.classList.remove("none");
        listSection.classList.add("none");
    }
})