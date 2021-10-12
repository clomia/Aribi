const constituents = document.querySelector("#id_constituents"),
    flavors = document.querySelector("#id_flavor_tags"),
    tagBox = document.querySelector(".tag-box");

function renderTag(ul, className) {
    // inputId로 input찾아서 click하면 checked 된다!
    for (let li of ul.querySelectorAll("li")) {
        let label = li.querySelector('label');
        let inputId = label.getAttribute("for");
        let text = label.innerText.trim();

        let div = document.createElement("div");
        div.classList.add("tag");
        div.classList.add(className);
        div.setAttribute("inputId", inputId);
        div.innerHTML = text;
        tagBox.appendChild(div);
    }
}

renderTag(constituents, "constituents");
renderTag(flavors, "flavors");