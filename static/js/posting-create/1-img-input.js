const imgBox = document.querySelector(".img-box"),
    addImgBtn = document.querySelector(".img-box__add-btn");
const imageMaxCount = 10;

function addImgBtnManage(add = true) {
    // 선택한 이미지 갯수가 많으면 버튼을 없애고 아니면 버튼을 보여줍니다.
    const imageMixin = document.querySelectorAll(".img-box__mixin");
    const usedElements = new Array();
    for (let ele of imageMixin) {
        console.log(ele);
        if (!ele.classList.contains("none")) {
            usedElements.push(ele);
        }
    }
    console.log(usedElements.length)
    let imageCount = usedElements.length;
    if (add) {
        imageCount += 1
        // 이미지를 추가할때는 추가 이전에 카운트하기때문에
        // 앞으로 추가될 이미지까지 +1 을 해줍니다.
    }
    if (imageCount >= imageMaxCount) {
        addImgBtn.classList.add("none");
    } else {
        addImgBtn.classList.remove("none");
    }
}

function makeImgInputMixin(count) {
    const imageName = `image.${count}`;

    let imgBoxMixin = document.createElement("div");
    let input = document.createElement("input");
    let image = document.createElement("img");

    imgBoxMixin.classList.add("img-box__mixin");
    imgBoxMixin.classList.add("none");

    input.classList.add("none");
    input.type = "file";
    input.name = imageName;
    input.accept = "image/*";

    image.classList.add("img-box__mixin__img");
    image.classList.add("none");
    image.width = "120px";
    image.height = "120px"

    input.onchange = event => {
        const [file] = input.files
        if (file) {
            addImgBtnManage();
            //----------------------------------
            imgBoxMixin.classList.remove("none");
            image.classList.remove("none");
            image.src = URL.createObjectURL(file);
            deleteBtn = document.createElement("div");
            deleteBtn.classList.add("img-box__mixin__delete-btn");
            deleteBtn.addEventListener("click", function (event) {
                imgBoxMixin.remove();
                addImgBtnManage(add = false);
            })
            imgBoxMixin.appendChild(deleteBtn);
        }
    }

    imgBoxMixin.appendChild(input);
    imgBoxMixin.appendChild(image);

    return imgBoxMixin;
}
let imageCounter = 0;
addImgBtn.addEventListener("click", function (event) {
    imgBoxMixin = makeImgInputMixin(imageCounter);
    imgBox.insertBefore(imgBoxMixin, addImgBtn);
    input = imgBoxMixin.querySelector("input");
    input.click();

    imageCounter += 1;
})

