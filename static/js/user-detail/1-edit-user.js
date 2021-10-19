window.onbeforeunload = function () {
    // 페이지를 떠날때 로딩시간동안 로딩 애니메이션
    document.querySelector(".loading").classList.remove("none");
}

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
    httpRequest.open("POST", "/users/update-ajax", true);
    // 이게 있어야 정보가 제대로 보내진다.
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // 이게 있어야 SCRF토큰 인증을 거칠 수 있다.
    httpRequest.setRequestHeader("X-CSRFToken", csrftoken);
    // 이것이 서버로 보낼 request이다. 쿼리형식을 지켜야 서버에서 QueryDict로 올바르게 변환된다
    httpRequest.send(data);
    return httpRequest;
}
const username = document.querySelector(".username-data").innerHTML.trim();
const nameSpace = document.querySelector(".profile-section__info__name");

const nameBtn = document.querySelector(".profile-section__info__config__name");
const passwordBtn = document.querySelector(".profile-section__info__config__password");
const secessionBtn = document.querySelector(".profile-section__info__config__secession");

const profileSection = document.querySelector(".profile-section");
const inputSection = document.querySelector(".input-section");
const inputSectionForm = inputSection.querySelector("form");
const targetUsername = inputSectionForm.querySelector("button").getAttribute("targetUsername");
const inputSectionFormInput = inputSectionForm.querySelector("input");
const cancelBtn = inputSectionForm.querySelector(".input-section__cancel");

function sendFormSetting(type) {
    inputSectionForm.onsubmit = function (event) {
        event.preventDefault();
        const value = inputSectionFormInput.value.trim()
        if (!value) {
            alert("공백은 제출할 수 없습니다.")
            return;
        }
        const httpRequest = sendData(`type=${type}&value=${value}&targetUsername=${targetUsername}`);
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                // 이상 없음, 응답 받았음
                let success = httpRequest.responseText;
                if (success) {
                    if (type === "name") {
                        nameSpace.innerHTML = value
                        profileSection.classList.remove("profile-section-btn-open");
                    } else if (type === "password") {
                        const a = alert("비밀번호가 변경되었습니다.");
                        // Blocking 필요해서 이렇게 함
                        document.location.href = "/users/login";
                        return;
                    }
                    inputSection.classList.add("none");
                    inputSectionFormInput.value = "";
                } else {
                    alert("요청이 잘못되었습니다.")
                }
            }
        }
    }
}

nameBtn.addEventListener("click", function () {
    inputSection.classList.add("none");
    inputSectionFormInput.value = "";
    inputSectionFormInput.setAttribute("type", "text");
    inputSectionFormInput.setAttribute("placeholder", "원하는 이름을 입력해주세요");
    inputSectionFormInput.setAttribute("maxlength", "15");
    if (inputSection.classList.contains("none")) {
        inputSection.classList.remove("none");
        sendFormSetting("name");
        profileSection.classList.add("profile-section-btn-open");
    } else {
        inputSection.classList.add("none");
        profileSection.classList.remove("profile-section-btn-open");
    }
})

passwordBtn.addEventListener("click", function () {
    inputSection.classList.add("none");
    inputSectionFormInput.value = "";
    inputSectionFormInput.setAttribute("type", "password");
    inputSectionFormInput.setAttribute("placeholder", "원하는 비밀번호를 입력해주세요");
    inputSectionFormInput.setAttribute("maxlength", "1000");
    if (inputSection.classList.contains("none")) {
        inputSection.classList.remove("none");
        sendFormSetting("password");
        profileSection.classList.add("profile-section-btn-open");
    } else {
        inputSection.classList.add("none");
        profileSection.classList.remove("profile-section-btn-open");
    }
})

cancelBtn.addEventListener("click", function (event) {
    inputSection.classList.add("none");
    profileSection.classList.remove("profile-section-btn-open");
})

secessionBtn.addEventListener("click", function (event) {
    const helpText = `
계정을 삭제하시면 그동안 작성한 모든 포스팅과 댓글,
그리고 댓글에 달린 답글까지 모두 삭제됩니다.
    
모든 데이터는 완전히 삭제되어 복구할 수 없습니다.

정말 삭제하시려면 "계정을 삭제하겠습니다"를 입력해주세요.
    `
    const answer = prompt(helpText);
    if (answer === "계정을 삭제하겠습니다") {
        const httpRequest = sendData(`type=removeUser&value=none&targetUsername=${targetUsername}`);
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                // 이상 없음, 응답 받았음
                let success = httpRequest.responseText;
                if (success) {
                    document.location.href = "/";
                } else {
                    alert("요청이 잘못되었습니다.")
                }
            }
        }
    } else if (answer !== null) {
        alert("계정 삭제를 원하신다면 값을 올바르게 입력해주세요.");
    }
})

const profileImageForm = document.querySelector(".profile-image-form");
const profileImageInput = profileImageForm.querySelector("input[type='file']");
const profileImage = document.querySelector(".profile-section__profile-image");

profileImage.addEventListener("click", function (event) {
    if (username === targetUsername) {
        profileImageInput.click()
    }
})

profileImage.addEventListener("mouseenter", function (event) {
    if (username === targetUsername) {
        profileImage.querySelector("div").classList.remove("none");
    }
})

profileImage.addEventListener("mouseleave", function (event) {
    if (username === targetUsername) {
        profileImage.querySelector("div").classList.add("none");
    }
})