// Ajax기술을 사용해서 Posting을 동적으로 로딩합니다.
//? csrf 토큰 생성해서 보내는 함수 - https://jinmay.github.io/2019/04/09/django/django-ajax-csrf/
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
//? ----------------------------------------CSRF----------------------------------------

function btnCheck() {
    const latestBtn = document.querySelector(".sort-btn__latest");

    if (latestBtn.classList.contains("sort-btn__selected")) {
        return "latest";
    } else {
        return "popularity";
    }
}

function getPostingSection(kind) {
    return document.querySelector(`.postings-section__${kind}`);
}

window.onscroll = function () {
    const totalPageHeight = document.body.scrollHeight;
    const scrollPoint = window.scrollY + window.innerHeight;

    console.log(scrollPoint, totalPageHeight)
    // scrollPoint == totalPageHeight 일때가 스크롤이 바닥에 닿은것.
    if (scrollPoint >= totalPageHeight) {
        // 포스팅들이 로딩된 후 값을 수동으로 새로고침한다. (확인해서 새로고침하기엔 너무 늦어서 앞뒤가 안맞는다.)
        console.log(scrollPoint, totalPageHeight)
        const httpRequest = new XMLHttpRequest();
        httpRequest.open("POST", "intro-posting-getter", true);
        // 이게 있어야 정보가 제대로 보내진다.
        httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // 이게 있어야 SCRF토큰 인증을 거칠 수 있다.
        httpRequest.setRequestHeader("X-CSRFToken", csrftoken);
        // 이것이 서버로 보낼 request이다. 쿼리형식을 지켜야 서버에서 QueryDict로 올바르게 변환된다
        orderBy = btnCheck();
        postings = getPostingSection(orderBy);
        //? order_by=현재 보여주는 정렬 종류 , offset=다음번에 받아야 할 포스팅 인덱스
        httpRequest.send("order_by=" + orderBy + "&" + "offset=" + postings.childElementCount);

        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                // 이상 없음, 응답 받았음
                postings.innerHTML = postings.innerHTML + httpRequest.responseText;
            } else {
                // 아직 준비되지 않음
            }
        }
        setTimeout(postingScripting, 2000); //! 한 2초 뒤 실행으로 해놓고 보다 미리 로딩하도록
    }
}