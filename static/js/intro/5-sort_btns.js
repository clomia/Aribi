const btnDiv = document.querySelector(".sort-btn"),
    latestBtn = document.querySelector(".sort-btn__latest"),
    popularityBtn = document.querySelector(".sort-btn__popularity"),
    latestPostings = document.querySelector(".postings-section__latest"),
    popularityPostings = document.querySelector(".postings-section__popularity");

latestBtn.addEventListener("click", function (event) {
    if (!latestBtn.classList.contains("sort-btn__selected")) {
        latestBtn.classList.add("sort-btn__selected");
        popularityBtn.classList.remove("sort-btn__selected");
        latestPostings.classList.remove("none");
        popularityPostings.classList.add("none");
    }
})

popularityBtn.addEventListener("click", function (event) {
    if (!popularityBtn.classList.contains("sort-btn__selected")) {
        popularityBtn.classList.add("sort-btn__selected");
        latestBtn.classList.remove("sort-btn__selected");
        popularityPostings.classList.remove("none");
        latestPostings.classList.add("none");
    }
})

