let _username = document.querySelector(".username-data").innerHTML.trim();
const resetBtn = document.querySelector(".list-reset-btn ");

if (resetBtn) {

    resetBtn.addEventListener("click", function (event) {
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
            httpRequest.open("POST", "/lists/update-ajax", true);
            // 이게 있어야 정보가 제대로 보내진다.
            httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            // 이게 있어야 SCRF토큰 인증을 거칠 수 있다.
            httpRequest.setRequestHeader("X-CSRFToken", csrftoken);
            // 이것이 서버로 보낼 request이다. 쿼리형식을 지켜야 서버에서 QueryDict로 올바르게 변환된다
            httpRequest.send(data);
            return httpRequest;
        }

        const resetBtnTargetUserPk = resetBtn.getAttribute("targetUserPk");
        const httpRequest = sendData(`type=resetList&targetUserPk=${resetBtnTargetUserPk}&username=${_username}`);
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                // 이상 없음, 응답 받았음
                let success = httpRequest.responseText;
                if (success) {
                    location.reload();
                } else {
                    alert("요청이 잘못되었습니다.")
                }
            }
        }
    })
}