const constituentOpenBtn = document.querySelector(".create-tag__btn-field__constituent-btn");
const flavorOpenBtn = document.querySelector(".create-tag__btn-field__flavor-btn");
const constituentCreate = document.querySelector(".create-tag__constituent");
const flavorCreate = document.querySelector(".create-tag__flavor");
const username = document.querySelector(".username").innerHTML;
const alcoholInput = document.querySelector(".create-tag__constituent__input-alcohol");
// ------
const labels = document.querySelectorAll(".label-wrap label");
const radioIdList = Array(...labels).map(ele => ele.getAttribute("for"));
const radioInputList = radioIdList.map(id => document.getElementById(id));

function detectMobileDevice(agent) {
    const mobileRegex = [
        /Android/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ]

    return mobileRegex.some(mobile => agent.match(mobile))
}

if (detectMobileDevice(window.navigator.userAgent)) {
    alcoholInput.setAttribute("placeholder", "알콜 도수 입력");
}

constituentOpenBtn.addEventListener("click", function (event) {
    constituentCreate.classList.remove("none");
    flavorCreate.classList.add("none");
})

flavorOpenBtn.addEventListener("click", function (event) {
    flavorCreate.classList.remove("none");
    constituentCreate.classList.add("none");
})

window.addEventListener('load', function () {
    for (let radioInput of radioInputList) {
        radioInput.addEventListener("change", function (event) {
            const constituentId = document.querySelector('input[name="kind"]:checked').value;
            const flavorId = document.querySelector('input[name="category"]:checked').value;
            const targetLabel = Array(...labels).filter(function (label) {
                label.classList.remove("selected-constituent");
                label.classList.remove("selected-flavor");
                return label.getAttribute("for") === constituentId || label.getAttribute("for") === flavorId;
            })
            const [constituentLabel, flavorLabel] = targetLabel;
            constituentLabel.classList.add("selected-constituent");
            flavorLabel.classList.add("selected-flavor");
            if (!(constituentId === "liquid")) {
                alcoholInput.classList.add('none');
            } else {
                alcoholInput.classList.remove('none');
            }
        })
    }
})


function addTag(name, className) {
    //* className은 복수로 넘기세요
    //1. tag input 생성
    //2. 태그 렌더링
    //3. 이벤트 리스너 등록 & 클릭

    // Input 생성
    const ul = document.querySelector(`#id_${className}`);
    const li = document.createElement("li");
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = className;
    input.value = name;
    input.classList.add("none");

    const lis = ul.querySelectorAll("li");
    const lastLi = lis[lis.length - 1];
    const lastId = lastLi.firstChild.getAttribute("for");
    _temp = lastId.split("_")
    const inputId = `id_${className}_${_temp[_temp.length - 1]}`;
    input.id = inputId;
    label.setAttribute("for", inputId);
    label.innerHTML = name;

    label.appendChild(input);
    li.appendChild(label);
    ul.appendChild(li);

    // 태그 렌더링
    if (className === "flavor_tags") {
        className = "flavors";
    }
    const div = document.createElement("div");
    div.classList.add("tag");
    div.classList.add(className);
    div.setAttribute("inputId", inputId);
    div.innerHTML = name;
    box = document.querySelector(`.tag-box__${className}__content__field`);
    box.insertBefore(div, box.firstChild);

    // 이벤트리스너 & 태그 클릭
    const selectedField = document.querySelector(`.tag-box__${className}__selected__field`);
    const tag = div;
    tag.addEventListener("click", function () {
        const selectedTag = tag.cloneNode(true);
        tag.classList.add("none");
        selectedTag.classList.add("selectedTag");

        selectedField.insertBefore(selectedTag, selectedField.firstChild);

        document.getElementById(tag.getAttribute("inputid")).click()

        selectedTag.addEventListener("click", function (event) {
            document.getElementById(tag.getAttribute("inputid")).click()
            selectedTag.remove();
            tag.classList.remove("none");
        })
    })
    //*이벤트리스너는 비동기로 실행되기때문에 태그가 추가된것을 확인한 후 스크롤하도록 한다.
    const seletedTagBox = document.querySelector(`.tag-box__${className}__selected__field`);

    let observer = new MutationObserver((mutations) => {
        if (seletedTagBox.firstChild) {
            seletedTagBox.firstChild.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    })
    observer.observe(seletedTagBox, { childList: true });

    tag.click()
}

//------------ AJAX----------------
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
let csrftoken = getCookie('csrftoken');

function sendData(data) {
    // Ajax로 데이터를 전송후 httpRequest객체를 반환합니다.

    const httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", "/archives/create", true);
    // 이게 있어야 정보가 제대로 보내진다.
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // 이게 있어야 SCRF토큰 인증을 거칠 수 있다.
    httpRequest.setRequestHeader("X-CSRFToken", csrftoken);
    // 이것이 서버로 보낼 request이다. 쿼리형식을 지켜야 서버에서 QueryDict로 올바르게 변환된다
    httpRequest.send(data);
    return httpRequest;
}

const constituentSubmitBtn = document.querySelector(".create-tag__constituent__submit");
const flavorSubmitBtn = document.querySelector(".create-tag__flavor__submit");

constituentSubmitBtn.addEventListener("click", function (event) {
    const type = document.querySelector('input[name="kind"]:checked').value;
    const name = document.querySelector(".create-tag__constituent__input-name").value;
    let alcohol = Number(alcoholInput.value);
    if (!name) {
        alert("재료 이름을 입력해주세요.");
        return;
    }
    if (isNaN(alcohol) || alcohol < 0 || alcohol > 100) {
        alert("올바른 알콜 도수를 입력해주세요.");
        return;
    }
    if (!username) {
        alert("로그인 후 이용해주세요.");
        return;
    }
    if (!alcohol) {
        alcohol = 0;
    }
    const className = "constituents";
    const httpRequest = sendData(`class=${className}&name=${name}&type=${type}&alcohol=${alcohol}&username=${username}`);
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            // 이상 없음, 응답 받았음
            success = Boolean(httpRequest.responseText);
            if (success) {
                addTag(name, className);
                constituentCreate.classList.add("none");
            } else {
                alert("이미 존재하는 태그입니다.");
            }
        }
    }
})


flavorSubmitBtn.addEventListener("click", function (event) {
    const type = document.querySelector('input[name="category"]:checked').value;
    const name = document.querySelector(".create-tag__flavor__input-expression").value;
    if (!name) {
        alert("맛을 입력해주세요.");
        return;
    }
    if (!username) {
        alert("로그인 후 이용해주세요.");
        return;
    }
    const alcohol = 0;
    const className = "flavor_tags";
    const httpRequest = sendData(`class=${className}&name=${name}&type=${type}&alcohol=${alcohol}&username=${username}`);
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            // 이상 없음, 응답 받았음
            success = Boolean(httpRequest.responseText);
            if (success) {
                addTag(name, className);
                constituentCreate.classList.add("none");
            } else {
                alert("이미 존재하는 태그입니다.");
            }
        }
    }
})
