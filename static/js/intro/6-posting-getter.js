//Ajax를 사용해서 포스팅을 서버로부터 제공받아 렌더링한다.

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

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
//? ----------------------------------------CSRF----------------------------------------
const latestSection = document.querySelector(".postings-section__latest");
const popularitySection = document.querySelector(".postings-section__popularity");

function createMessage() {
    // 왜 조건문에 스코프가 적용되는거같지..?
    const sortBtn = document.querySelector(".sort-btn");
    if (sortBtn.classList.contains("latest")) {
        let order_by = "latest";
        let miniPostings = latestSection.querySelectorAll(".posting-mini");
        let offset = miniPostings.length;
        return [`order_by=${order_by}&offset=${offset}`, latestSection]
    } else {
        let order_by = "popularity";
        let miniPostings = popularitySection.querySelectorAll(".posting-mini");
        let offset = miniPostings.length;
        return [`order_by=${order_by}&offset=${offset}`, popularitySection]
    }
}

function sendData(data) {
    // Ajax로 데이터를 전송후 httpRequest객체를 반환합니다.

    const httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", "intro-posting-getter", true);
    // 이게 있어야 정보가 제대로 보내진다.
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // 이게 있어야 SCRF토큰 인증을 거칠 수 있다.
    httpRequest.setRequestHeader("X-CSRFToken", csrftoken);
    // 이것이 서버로 보낼 request이다. 쿼리형식을 지켜야 서버에서 QueryDict로 올바르게 변환된다
    httpRequest.send(data);
    return httpRequest;
}
window.scrollTo({ top: 0, behavior: 'smooth' });
window.onscroll = function () {
    const totalPageHeight = document.body.scrollHeight;
    const scrollPoint = window.scrollY + window.innerHeight;
    if (scrollPoint >= totalPageHeight) {
        let [message, scope] = createMessage();
        const httpRequest = sendData(message);
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                // 이상 없음, 응답 받았음
                let responseHtml = httpRequest.responseText;
                // scope.innerHTML += response; 이렇게 하면 DOM객체가 망가지고 JS가 먹통이 된다!
                const newHtml = new DOMParser().parseFromString(responseHtml, 'text/html');
                const newEles = newHtml.querySelectorAll("body a")
                newEles.forEach(function (ele) {
                    scope.append(ele)
                })
            }
        }
    }
}
