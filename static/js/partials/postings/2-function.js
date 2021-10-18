function resize(obj) {
    obj.style.height = "31px";
    obj.style.height = obj.scrollHeight + "px";
}

function closeReplyReply(obj) {
    const replyReplyFormOpeners = document.querySelectorAll(".posting__x6__comment__reply__info__reply-btn");
    const replyFormOpeners = document.querySelectorAll(".posting__x6__comment__info__reply-btn");
    replyReplyFormOpeners.forEach(function (ele) {
        ele.innerHTML = "답글작성";
    })
    replyFormOpeners.forEach(function (ele) {
        ele.innerHTML = "답글작성";
    })

    const replyForms = document.querySelectorAll(".reply-form");
    replyForms.forEach(function (ele) {
        ele.parentElement.classList.add("none");
    })
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

function postingDelete(obj) {
    function sendData(data) {
        // Ajax로 데이터를 전송후 httpRequest객체를 반환합니다.

        const httpRequest = new XMLHttpRequest();
        httpRequest.open("POST", "/postings/update-ajax", true);
        // 이게 있어야 정보가 제대로 보내진다.
        httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // 이게 있어야 SCRF토큰 인증을 거칠 수 있다.
        httpRequest.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        // 이것이 서버로 보낼 request이다. 쿼리형식을 지켜야 서버에서 QueryDict로 올바르게 변환된다
        httpRequest.send(data);
        return httpRequest;
    }
    let accept = confirm("포스팅을 삭제하시겠습니까?");
    if (accept) {
        let posting = obj.parentElement.parentElement.parentElement.parentElement
        let postingPk = posting.querySelector(".posting-pk").innerHTML.trim()
        let username = posting.querySelector(".username").innerHTML.trim()
        httpRequest = sendData(`type=removePosting&postingPk=${postingPk}&username=${username}`);
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                // 이상 없음, 응답 받았음
                success = Boolean(httpRequest.responseText);
                if (success) {
                    document.location.href = "/";
                    // Posting Detail Page의 경우도 있기 때문에 무조건 redirect 해주는게 맞다.
                } else {
                    alert("포스팅을 삭제할 수 없습니다. 로그인하지 않았거나 당신이 작성한 포스팅이 아닙니다.");
                }
            }
        }
    }
}
