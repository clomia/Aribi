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