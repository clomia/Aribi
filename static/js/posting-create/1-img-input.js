window.onbeforeunload = function () {
    // 페이지를 떠날때 로딩시간동안 로딩 애니메이션
    document.querySelector(".loading").classList.remove("none");
}

//svg위치: templates/svg/eraser_icon.html
const eraserIconSvg = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
    y="0px" width="25px" height="25px" viewBox="0 0 600 600" xml:space="preserve">
    <path d="M381.327,513.584c1.335,0,2.67,0.001,4.005,0
	c63.344-0.028,126.687-0.061,190.03-0.071c2.252,0,4.504,0.276,6.758,0.345c7.356,0.225,13.859,10.212,12.7,16.691
	c-0.49,2.75,0.214,5.084,0.037,7.526c-0.158,2.231-1.546,4.631-3.008,6.467c-3.919,4.925-9.525,7.11-15.557,7.168
	c-31.334,0.291-62.671,0.364-94.007,0.416c-36.627,0.059-73.254,0.018-109.88,0.018s-73.254,0.001-109.88-0.004
	c-28.348-0.006-56.696-0.042-85.044-0.022c-11.063,0.006-21.971-0.702-31.989-6.099c-1.089-0.587-2.131-1.284-3.12-2.03
	c-17.749-13.412-32.659-29.851-48.348-45.45c-22.047-21.924-43.97-43.971-65.974-65.936c-1.496-1.493-3.133-2.893-4.876-4.081
	c-4.568-3.122-7.199-7.75-9.993-12.292c-7.639-12.414-9.319-26.085-7.421-40.091c1.277-9.423,4.871-18.264,11.814-25.288
	c30.984-31.345,61.907-62.747,92.967-94.017c22.275-22.425,44.754-44.648,67.103-67.001
	c39.376-39.382,78.719-78.796,118.082-118.192c4.965-4.969,9.581-10.381,15.036-14.742c8.951-7.157,17.002-15.718,29.003-18.4
	c14.459-3.231,28.019-1.49,41.274,4.969c7.924,3.86,13.351,10.471,19.332,16.415c40.928,40.67,81.718,81.476,122.514,122.276
	c15.865,15.867,31.67,31.797,47.425,47.772c4.937,5.006,10.541,9.693,14.168,15.559c3.723,6.018,6.72,13.127,7.633,20.073
	c1.091,8.289,0.588,17.095-0.991,25.338c-1.647,8.61-5.556,16.851-11.893,23.269c-10.371,10.505-21.208,20.546-31.652,30.978
	c-54.808,54.743-109.556,109.546-164.314,164.341c-0.912,0.914-1.674,1.98-2.506,2.977
	C380.945,512.839,381.137,513.21,381.327,513.584z M353.085,75.309c-1.759,0.534-4.686,0.815-6.882,2.233
	c-3.296,2.129-6.258,4.875-9.053,7.667c-40.886,40.831-81.721,81.711-122.564,122.583c-4.866,4.87-4.893,6.604-0.029,11.467
	c65.073,65.066,130.153,130.126,195.242,195.174c6.242,6.239,7.335,6.185,13.65-0.13c38.671-38.661,77.351-77.313,115.993-115.998
	c4.231-4.237,8.535-8.448,12.317-13.07c5.622-6.87,2.703-20.655-4.918-25.291c-1.899-1.155-3.718-2.553-5.288-4.123
	c-46.03-45.979-92.027-91.992-138.025-138.006c-12.051-12.055-24.336-23.89-35.986-36.319
	C363.595,77.284,359.255,75.936,353.085,75.309z M42.846,385.376c0.331,1.705,0.597,3.425,1.006,5.11
	c1.379,5.687,6.183,9.017,9.86,12.744c31.348,31.786,63.05,63.224,94.631,94.781c1.683,1.682,3.044,3.724,4.87,5.212
	c3.849,3.135,7.541,6.896,11.987,8.734c4.073,1.682,9.053,1.557,13.635,1.566c38.376,0.085,76.752-0.009,115.128,0.02
	c8.48,0.007,16.96,0.423,25.44,0.351c2.24-0.02,4.952-0.562,6.607-1.901c3.336-2.701,6.039-6.17,9.1-9.227
	c16.23-16.214,32.495-32.396,48.742-48.595c4.266-4.254,4.268-6.328-0.046-10.676c-5.476-5.519-10.993-10.996-16.49-16.493
	c-37.068-37.061-74.137-74.124-111.206-111.186c-23.412-23.408-46.819-46.818-70.241-70.217c-3.348-3.344-5.679-3.392-8.921-0.154
	c-32.72,32.686-65.396,65.413-98.158,98.056c-9.403,9.371-18.822,18.748-28.678,27.63C45.665,375.14,43.055,379.413,42.846,385.376z
	" />
</svg>
`


const imgBox = document.querySelector(".img-box"),
    addImgBtn = document.querySelector(".img-box__add-btn");
const imageMaxCount = 10;

function addImgBtnManage(add = true) {
    // 선택한 이미지 갯수가 많으면 버튼을 없애고 아니면 버튼을 보여줍니다.
    const imageMixin = document.querySelectorAll(".img-box__mixin");
    const usedElements = new Array();
    for (let ele of imageMixin) {
        if (!ele.classList.contains("none")) {
            usedElements.push(ele);
        }
    }
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
    image.width = 120;
    image.height = 120;

    input.onchange = event => {
        const [file] = input.files
        if (file) {
            addImgBtnManage();
            //----------------------------------
            addImgBtn.classList.remove('sexy-btn');
            addImgBtn.innerHTML = "이미지 추가하기";

            imgBoxMixin.classList.remove("none");
            image.classList.remove("none");
            image.src = URL.createObjectURL(file);
            deleteBtn = document.createElement("div");
            deleteBtn.innerHTML = eraserIconSvg;
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


let observer = new MutationObserver((mutations) => {
    const imageMixin = document.querySelectorAll(".img-box__mixin");
    const usedElements = new Array();
    for (let ele of imageMixin) {
        if (!ele.classList.contains("none")) {
            usedElements.push(ele);
        }
    }
    let imageCount = usedElements.length;
    if (!imageCount) {
        addImgBtn.classList.add('sexy-btn');
        addImgBtn.innerHTML = "이미지 선택하기";
    } else {
        addImgBtn.classList.remove('sexy-btn');
        addImgBtn.innerHTML = "이미지 추가하기";
    }
})

observer.observe(imgBox, { childList: true });
