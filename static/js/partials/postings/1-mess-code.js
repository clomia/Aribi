function coloring(tag, kind) {
    switch (kind) {
        case "액체":
            tag.classList.add("posting-tag-liquid")
            break;
        case "재료":
            tag.classList.add("posting-tag-ingredient")
            break;
        case "용품":
            tag.classList.add("posting-tag-equipment")
            break;
        case "과일맛":
            tag.classList.add("posting-tag-fruit")
            break;
        case "식물맛":
            tag.classList.add("posting-tag-plant")
            break;
        case "기본맛":
            tag.classList.add("posting-tag-teste")
            break;
        case "향신료맛":
            tag.classList.add("posting-tag-spice")
            break;
        case "입안 감촉":
            tag.classList.add("posting-tag-texture")
            break;
        case "냄새":
            tag.classList.add("posting-tag-scent")
            break;
        case "색감":
            tag.classList.add("posting-tag-color")
            break;
        case "기타 특징":
            tag.classList.add("posting-tag-other")
            break;
        default:
            break;
    }
}
const replyUsedPostingObj = [];
// 답글이 만든 답글이 답글을 달때는 Posting변수에 접근할 수가 없다 그래서 여기에 두고 쓰려고 한다. (댓글이 만든 답글도 마찬가지)
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

function makeReply(content, name, username, userPk, replyPk, commentPk, imageUrl, commentSection, posting) {

    replyUsedPostingObj.push(posting)
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

    //! 유저 프로필 패이지 만들면 여기에 userPk사용해서 링크 추가!!
    const replyBox = document.createElement("div");
    replyBox.classList.add("posting__x6__comment__reply");
    //----------------
    const info = document.createElement("div");
    info.classList.add("posting__x6__comment__reply__info");
    replyBox.append(info);
    //------------
    const profile = document.createElement("div");
    profile.classList.add("posting__x6__comment__reply__info__profile");
    const img = document.createElement("img");
    img.setAttribute("src", imageUrl);
    img.setAttribute("width", "30");
    img.setAttribute("heignt", "30");
    profile.append(img);
    info.append(profile);
    //------------
    const createdBy = document.createElement("div");
    createdBy.classList.add("posting__x6__comment__reply__info__created_by");
    createdBy.innerHTML = ` ${name} `; //한칸씩 공백 있음!
    info.append(createdBy);
    const createdAgo = document.createElement("div");
    createdAgo.classList.add("posting__x6__comment__reply__info__created_ago");
    createdAgo.innerHTML = " 방금 ";
    info.append(createdAgo);
    //-------------
    const likeBtn = document.createElement("div");
    likeBtn.classList.add("posting__x6__comment__reply__info__like-btn");
    likeBtn.setAttribute("replyPk", replyPk);
    likeBtn.innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="80px" height="80px" viewBox="0 0 500 500" style="user-select: auto;" xml:space="preserve">
    <path style="fill-rule: evenodd; clip-rule: evenodd; user-select: auto;" d="M249.956,476.814c-26.019-24.189-51.336-47.111-75.944-70.768
        c-35.944-34.549-72.289-68.758-106.747-104.75C38.116,270.859,14.192,236.235,5.11,194.006
        C-11.334,117.561,25.645,43.068,111.906,24.867c45.844-9.671,83.115,9.72,114.561,41.954c8.054,8.247,15.341,17.241,23.271,26.231
        c10.725-11.49,20.434-23.381,31.637-33.627c35.977-32.914,77.045-46.44,124.875-29.596c49.619,17.471,80.486,51.428,90.053,103.808
        c9.434,51.612-8.465,95.569-37.764,136.472c-27.664,38.615-62.906,70.051-96.93,102.59c-32.088,30.693-64.742,60.793-97.182,91.127
        C259.979,467.984,255.363,471.975,249.956,476.814z"></path></svg>`;
    info.append(likeBtn);
    //----------------
    const likeCount = document.createElement("div");
    likeCount.classList.add("posting__x6__comment__reply__info__like");
    likeCount.innerHTML = " 좋아요 0개 ";
    info.append(likeCount);
    const replyBtn = document.createElement("div");
    replyBtn.classList.add("posting__x6__comment__reply__info__reply-btn");
    replyBtn.innerHTML = " 답글작성 ";
    info.append(replyBtn);
    const delBtn = document.createElement("div");
    delBtn.classList.add("posting__x6__comment__reply__info__delete-btn");
    delBtn.innerHTML = " 삭제 ";
    info.append(delBtn);
    //*------info 완성-----------
    const main = document.createElement("div");
    main.classList.add("posting__x6__comment__main");
    main.innerText = content.value;
    replyBox.append(main);
    //-------
    const form = document.createElement("form");
    form.classList.add("none")
    const replyForm = document.createElement("div");
    replyForm.classList.add("reply-form");
    const textArea = document.createElement("textarea");
    textArea.setAttribute("name", "reply");
    textArea.setAttribute("maxlength", "200");
    textArea.setAttribute("cols", "30");
    textArea.setAttribute("rows", "10");
    textArea.setAttribute("onkeydown", "resize(this)");
    textArea.setAttribute("onkeyup", "resize(this)");
    textArea.required = true;
    const replySubmit = document.createElement("div");
    replySubmit.innerHTML = "작성";
    replySubmit.setAttribute("commentPk", commentPk)
    replySubmit.setAttribute("onclick", "closeReplyReply(this)")

    replyForm.append(textArea)
    replyForm.append(replySubmit)
    form.append(replyForm)
    main.append(form)
    //*--------main 완성----------
    likeBtn.addEventListener("click", function (event) {
        if (likeBtn.classList.contains("commentLiked")) {
            // Like 제거!
            httpRequest = sendData(`type=removeReplyLike&replyPk=${replyPk}&username=${username}`);
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    // 이상 없음, 응답 받았음
                    success = Boolean(httpRequest.responseText);
                    if (success) {
                        likeBtn.classList.remove("commentLiked");
                        const likeInnerHTML = likeCount.innerHTML;
                        const likeCountParse = likeInnerHTML.split("개")[0].split(" ");
                        const likeCountNumber = Number(likeCountParse[likeCountParse.length - 1]);
                        likeCount.innerHTML = ` 좋아요 ${likeCountNumber - 1}개 `;
                    }
                }
            }
        } else {
            // Like 입력!
            httpRequest = sendData(`type=replyLike&replyPk=${replyPk}&username=${username}`);
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    // 이상 없음, 응답 받았음
                    login = Boolean(httpRequest.responseText);
                    if (login) {
                        likeBtn.classList.add("commentLiked");
                        const likeInnerHTML = likeCount.innerHTML;
                        const likeCountParse = likeInnerHTML.split("개")[0].split(" ");
                        const likeCountNumber = Number(likeCountParse[likeCountParse.length - 1]);
                        likeCount.innerHTML = ` 좋아요 ${likeCountNumber + 1}개 `;
                    } else {
                        alert("좋아요 입력은 로그인이 필요합니다.");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        return;
                    }
                }
            }
        }
    })

    replyBtn.addEventListener("click", function (event) {
        if (form.classList.contains("none")) {
            form.classList.remove("none");
            replyBtn.innerHTML = "작성취소";
            let textArea = form.querySelector("div").querySelector("textarea");
            textArea.value = `Re.${name}  `;
        } else {
            form.classList.add("none");
            replyBtn.innerHTML = "답글작성";
        }
    })

    replySubmit.addEventListener("click", function (event) {
        let replyText = replyForm.querySelector("textarea");
        httpRequest = sendData(`type=reply&commentPk=${commentPk}&username=${username}&text=${replyText.value}`)
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                // 이상 없음, 응답 받았음
                data = httpRequest.responseText;
                if (data) {
                    //! 답글 추가
                    let [name, imageUrl, userPk, replyPk, commentPk] = data.split("&$");
                    let replyBox = null;
                    if (!posting) {
                        // 답글이 만든 답글인 경우
                        if (replyUsedPostingObj.length === 1) {
                            // 저장하고 사용 가능한 Posting은 하나뿐, 그 이상이면 그냥 포기하고 reload할꺼임
                            let getPosting = replyUsedPostingObj[0]
                            replyBox = makeReply(replyText, name, username, userPk, replyPk, commentPk, imageUrl, getPosting);
                        } else {
                            let _ = alert("도배 방지, 새로고침이 필요합니다.");
                            location.reload();
                        }
                    } else {
                        replyBox = makeReply(replyText, name, username, userPk, replyPk, commentPk, imageUrl, posting);
                    }
                    let mark = false;
                    for (let commentInfo of posting.querySelectorAll(".posting__x6__comment__info")) {
                        let inCommentPk = commentInfo.querySelector(".posting__x6__comment__info__like-btn").getAttribute("commentPk");
                        if (mark) {
                            commentSection.insertBefore(replyBox, commentInfo);
                            mark = false;
                        }
                        if (Number(inCommentPk) === Number(commentPk)) {
                            //이제 다음번 commentInfo 위에다가 삽입하면 된다!
                            mark = true;
                        }
                    }
                    if (mark) {
                        // for문이 끝났는데도 마크가 살아있다 = 아래에 코멘트가 더 없다 = 그냥 마지막에 넣으면 된다.
                        commentSection.append(replyBox);
                    }
                    replyBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    alert("댓글 작성은 로그인이 필요합니다.")
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
            }
        }
    })

    delBtn.addEventListener("click", function (event) {
        let httpRequest = sendData(`type=removeReply&replyPk=${replyPk}&username=${username}`);
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                // 이상 없음, 응답 받았음
                success = Boolean(httpRequest.responseText);
                if (success) {
                    replyBox.remove();
                } else {
                    alert("잘못된 접근입니다. 로그인하지 않았거나, 당신이 작성한 답글이 아닙니다.");
                    return;
                }
            }
        }
    })
    return replyBox
}

function makeComment(content, name, username, userPk, commentPk, imageUrl, commentSection, posting) {
    replyUsedPostingObj.push(posting)
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

    const info = document.createElement("div");
    info.classList.add("posting__x6__comment__info");
    //------------
    const profile = document.createElement("div");
    profile.classList.add("posting__x6__comment__info__profile");
    const img = document.createElement("img");
    img.setAttribute("src", imageUrl);
    img.setAttribute("width", "30");
    img.setAttribute("heignt", "30");
    profile.append(img);
    info.append(profile);
    //------------
    const createdBy = document.createElement("div");
    createdBy.classList.add("posting__x6__comment__info__created_by");
    createdBy.innerHTML = ` ${name} `; //한칸씩 공백 있음!
    info.append(createdBy);
    const createdAgo = document.createElement("div");
    createdAgo.classList.add("posting__x6__comment__info__created_ago");
    createdAgo.innerHTML = " 방금 ";
    info.append(createdAgo);
    //-------------
    const likeBtn = document.createElement("div");
    likeBtn.classList.add("posting__x6__comment__info__like-btn");
    likeBtn.setAttribute("commentpk", commentPk);
    likeBtn.innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="80px" height="80px" viewBox="0 0 500 500" style="user-select: auto;" xml:space="preserve">
    <path style="fill-rule: evenodd; clip-rule: evenodd; user-select: auto;" d="M249.956,476.814c-26.019-24.189-51.336-47.111-75.944-70.768
        c-35.944-34.549-72.289-68.758-106.747-104.75C38.116,270.859,14.192,236.235,5.11,194.006
        C-11.334,117.561,25.645,43.068,111.906,24.867c45.844-9.671,83.115,9.72,114.561,41.954c8.054,8.247,15.341,17.241,23.271,26.231
        c10.725-11.49,20.434-23.381,31.637-33.627c35.977-32.914,77.045-46.44,124.875-29.596c49.619,17.471,80.486,51.428,90.053,103.808
        c9.434,51.612-8.465,95.569-37.764,136.472c-27.664,38.615-62.906,70.051-96.93,102.59c-32.088,30.693-64.742,60.793-97.182,91.127
        C259.979,467.984,255.363,471.975,249.956,476.814z"></path></svg>`;
    info.append(likeBtn);
    //----------------
    const likeCount = document.createElement("div");
    likeCount.classList.add("posting__x6__comment__info__like");
    likeCount.innerHTML = " 좋아요 0개 ";
    info.append(likeCount);
    const replyCount = document.createElement("div");
    replyCount.classList.add("posting__x6__comment__info__reply-count");
    replyCount.innerHTML = " 답글 0개 ";
    info.append(replyCount);
    const replyBtn = document.createElement("div");
    replyBtn.classList.add("posting__x6__comment__info__reply-btn");
    replyBtn.innerHTML = " 답글작성 ";
    info.append(replyBtn);
    const delBtn = document.createElement("div");
    delBtn.classList.add("posting__x6__comment__info__delete-btn");
    delBtn.innerHTML = " 삭제 ";
    info.append(delBtn);
    //*------info 완성-----------
    const main = document.createElement("div");
    main.classList.add("posting__x6__comment__main");
    main.innerText = content;
    //-------
    const form = document.createElement("form");
    form.classList.add("none")
    const replyForm = document.createElement("div");
    replyForm.classList.add("reply-form");
    const textArea = document.createElement("textarea");
    textArea.setAttribute("name", "reply");
    textArea.setAttribute("maxlength", "200");
    textArea.setAttribute("cols", "30");
    textArea.setAttribute("rows", "10");
    textArea.setAttribute("onkeydown", "resize(this)");
    textArea.setAttribute("onkeyup", "resize(this)");
    textArea.required = true;
    const replySubmit = document.createElement("div");
    replySubmit.innerHTML = "작성";
    replySubmit.setAttribute("commentPk", commentPk)
    replySubmit.setAttribute("onclick", "closeReplyReply(this)")

    replyForm.append(textArea)
    replyForm.append(replySubmit)
    form.append(replyForm)
    main.append(form)
    //*--------main 완성----------
    likeBtn.addEventListener("click", function (event) {
        if (likeBtn.classList.contains("commentLiked")) {
            // Like 제거!
            httpRequest = sendData(`type=removeCommentLike&commentPk=${commentPk}&username=${username}`);
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    // 이상 없음, 응답 받았음
                    success = Boolean(httpRequest.responseText);
                    if (success) {
                        likeBtn.classList.remove("commentLiked");
                        const likeInnerHTML = likeCount.innerHTML;
                        const likeCountParse = likeInnerHTML.split("개")[0].split(" ");
                        const likeCountNumber = Number(likeCountParse[likeCountParse.length - 1]);
                        likeCount.innerHTML = ` 좋아요 ${likeCountNumber - 1}개 `;
                    }
                }
            }
        } else {
            // Like 입력!
            httpRequest = sendData(`type=commentLike&commentPk=${commentPk}&username=${username}`);
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    // 이상 없음, 응답 받았음
                    login = Boolean(httpRequest.responseText);
                    if (login) {
                        likeBtn.classList.add("commentLiked");
                        const likeInnerHTML = likeCount.innerHTML;
                        const likeCountParse = likeInnerHTML.split("개")[0].split(" ");
                        const likeCountNumber = Number(likeCountParse[likeCountParse.length - 1]);
                        likeCount.innerHTML = ` 좋아요 ${likeCountNumber + 1}개 `;
                    } else {
                        alert("좋아요 입력은 로그인이 필요합니다.");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        return;
                    }
                }
            }
        }
    })

    replyBtn.addEventListener("click", function (event) {
        if (form.classList.contains("none")) {
            form.classList.remove("none");
            replyBtn.innerHTML = "작성취소";
            let textArea = form.querySelector("div").querySelector("textarea");
        } else {
            form.classList.add("none");
            replyBtn.innerHTML = "답글작성";
        }
    })

    replySubmit.addEventListener("click", function (event) {
        let replyText = replyForm.querySelector("textarea");
        httpRequest = sendData(`type=reply&commentPk=${commentPk}&username=${username}&text=${replyText.value}`)
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                // 이상 없음, 응답 받았음
                data = httpRequest.responseText;
                if (data) {
                    //! 답글 추가
                    let [name, imageUrl, userPk, replyPk, commentPk] = data.split("&$");
                    let replyBox = null;
                    if (!posting) {
                        // 답글이 만든 답글인 경우
                        if (replyUsedPostingObj.length === 1) {
                            // 저장하고 사용 가능한 Posting은 하나뿐, 그 이상이면 그냥 포기하고 reload할꺼임
                            let getPosting = replyUsedPostingObj[0]
                            replyBox = makeReply(replyText, name, username, userPk, replyPk, commentPk, imageUrl, getPosting);
                        } else {
                            let _ = alert("도배 방지, 새로고침이 필요합니다.");
                            location.reload();
                        }
                    } else {
                        replyBox = makeReply(replyText, name, username, userPk, replyPk, commentPk, imageUrl, posting);
                    }
                    let mark = false;
                    for (let commentInfo of posting.querySelectorAll(".posting__x6__comment__info")) {
                        let inCommentPk = commentInfo.querySelector(".posting__x6__comment__info__like-btn").getAttribute("commentPk");
                        if (mark) {
                            commentSection.insertBefore(replyBox, commentInfo);
                            mark = false;
                        }
                        if (Number(inCommentPk) === Number(commentPk)) {
                            //이제 다음번 commentInfo 위에다가 삽입하면 된다!
                            mark = true;
                        }
                    }
                    if (mark) {
                        // for문이 끝났는데도 마크가 살아있다 = 아래에 코멘트가 더 없다 = 그냥 마지막에 넣으면 된다.
                        commentSection.append(replyBox);
                    }
                } else {
                    alert("댓글 작성은 로그인이 필요합니다.")
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
            }
        }
    })
    delBtn.addEventListener("click", function (event) {
        let httpRequest = sendData(`type=removeComment&commentPk=${commentPk}&username=${username}`);
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                // 이상 없음, 응답 받았음
                success = Boolean(httpRequest.responseText);
                if (success) {
                    let _ = alert("댓글이 삭제되었습니다.");
                    location.reload();
                } else {
                    alert("잘못된 접근입니다. 로그인하지 않았거나, 당신이 작성한 댓글이 아닙니다.");
                    return;
                }
            }
        }
    })

    return [info, main]
}

function postingScript(posting) {
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
    const username = posting.querySelector(".username").innerHTML;
    const postingPk = posting.querySelector(".posting-pk").innerHTML;
    //* x1
    // 메뉴버튼 출렁거리기
    let menuBtn = posting.querySelector(".posting__x1__menu-btn"),
        dot1 = posting.querySelector(".c1"),
        dot2 = posting.querySelector(".c2"),
        dot3 = posting.querySelector(".c3");
    menuBtn.addEventListener("mouseenter",
        function (event) {
            dot1.classList.add("c1-bounce");
            dot2.classList.add("c2-bounce");
            dot3.classList.add("c3-bounce");
        }
    )
    menuBtn.addEventListener("mouseleave",
        function (event) {
            dot1.classList.remove("c1-bounce");
            dot2.classList.remove("c2-bounce");
            dot3.classList.remove("c3-bounce");
        }
    )
    // 메뉴 나타나기
    let menu = posting.querySelector(".posting__x1__menu-btn__box")
    menu.classList.add("none");
    menuBtn.addEventListener("click", function (event) {
        if (Array(...menu.classList).includes("none")) {
            menu.classList.remove("none");
        } else {
            menu.classList.add("none");
        }
    })
    // *x2
    let postingWidth = 615
    if (screen.width < postingWidth) {
        postingWidth = screen.width
    }
    let slider = posting.querySelector(".posting__x2__slider"),
        images = posting.querySelectorAll(".posting__x2__slider__img");
    /* 
    이미지 resizing 
    한 포스팅에 있는 이미지들에서
    프레임 비율과 가장 유사한 비율을 가진 이미지를 고른 후 
    해당 이미지의 비율에 맞게 다른 이미지들을 변환시킨다
    if 세로로 길다면:
        가로길이가 꽉차도록 한 뒤 넘치는 세로길이를 자른다
    if 가로로 길다면:
        세로길이가 꽉차도록 한 뒤 넘치는 가로길이를 자른다
    */
    function getImage(ele) {
        return ele.querySelector(".posting__x2__slider__img__file").querySelector("img");
    }
    let compareArray = new Array();
    let maxheight = 700;
    for (let image of images) {
        image = getImage(image);
        // [ 프레임 비율과 이미지 비율의 차이 , 이미지 DOM ]
        compareArray.push([Math.abs(image.getAttribute("heightForJS") / image.getAttribute("widthForJS") - maxheight / postingWidth), image]);
    }
    compareArray.sort((a, b) => a[0] - b[0]);
    // 프레임과 가장 비율이 유사한 이미지의 가로 세로 비율
    let baseImage = compareArray[0][1];
    let baseRatio = { x: baseImage.width, y: baseImage.height };
    let frameHeight = postingWidth * (baseRatio.y / baseRatio.x)
    if (frameHeight > maxheight) {
        frameHeight = maxheight;
    }
    // 프레임의 세로길이는 baseRatio를 기준으로 해서 여기서 계산해놓는다(이후고정)
    // baseImage도 이후 변환을 거치기 때문에 baseImage.height는 frameHeight로 쓸 수 없다!!

    for (let image of images) {
        let frame = image.querySelector(".posting__x2__slider__img__file");
        image = getImage(image);
        if ((baseRatio.x / baseRatio.y) < (image.width / image.height)) {
            /* 이미지가 기준 비율보다 가로로 길때
            세로를 프레임까지 늘리고
            그만큼 늘어난 가로는 CSS에서 자름*/
            image.height = `${frameHeight}`; // 문자열 타입이어야 함!!
            // frame여러개라서 JS에서 이렇게 명시적으로 넣어줘야 함
            frame.style.height = `${frameHeight}px`;
            // 호환성을 위한 확실한 적용
            image.setAttribute("height", `${frameHeight}`);
            frame.setAttribute("style", `height:${frameHeight}px`);
        } else {
            /* 이미지가 기준 비율보다 세로로 길때
            이미지의 가로를 postingWidth로 하고(늘리고)
            그만큼 늘어난 세로는 CSS에서 자름*/
            image.width = `${postingWidth}`; // 문자열 타입이어야 함!!
            frame.style.height = `${frameHeight}px`;
            // 호환성을 위한 확실한 적용
            image.setAttribute("width", `${postingWidth}`);
            frame.setAttribute("style", `height:${frameHeight}px`);
        }
    }

    // 이미지 스크롤 기능, 모바일에는 패널이 없도록 CSS에서 쿼리처리함
    // 모두 첫 위치로 초기화
    slider.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    let leftPanel = posting.querySelector(".posting__x2__left"),
        rightPanel = posting.querySelector(".posting__x2__right");
    let imageCount = images.length;

    if (imageCount > 1) {
        // 이미지 스크롤
        rightPanel.addEventListener("click", function (event) {
            slider.scrollBy({ top: 0, left: postingWidth, behavior: 'auto' });
            leftPanel.classList.remove("none");
        })
        leftPanel.addEventListener("click", function (event) {
            slider.scrollBy({ top: 0, left: -postingWidth, behavior: 'auto' });
            rightPanel.classList.remove("none");
        })
        // 끝에 닿은거 감지하고 버튼 없애는 구현
        slider.addEventListener("scroll", function (event) {
            if (slider.scrollLeft + 15 >= postingWidth * imageCount - postingWidth) {
                rightPanel.classList.add("none");
            }
            if (slider.scrollLeft === 0) {
                leftPanel.classList.add("none");
            }
        })
    } else {
        leftPanel.classList.add("none");
        rightPanel.classList.add("none");
    }

    // 더블터치(클릭) 좋아요 구현
    let centerPanel = posting.querySelector(".posting__x2__center"),
        like = posting.querySelector(".posting__x2__like"),
        likeBtn = posting.querySelector(".posting__x2__like-btn"),
        likeText = posting.querySelector(".posting__x3__likes");
    function addLike(event) {
        // like는 효과 liked는 구분자
        const httpRequest = sendData(`type=postingLike&postingPk=${postingPk}&username=${username}`);
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                // 이상 없음, 응답 받았음
                login = Boolean(httpRequest.responseText);
                if (login) {
                    if (Array(...likeBtn.classList).includes("liked")) {
                        return;
                    } else {
                        likeBtn.classList.add("liked");
                        like.classList.add("like");
                        setTimeout(function () {
                            like.classList.remove("like");
                        }, 900);
                        const likeInnerHTML = likeText.innerHTML;
                        const likeTextParse = likeInnerHTML.split("개")[0].split(" ");
                        const likeCount = Number(likeTextParse[likeTextParse.length - 1]);
                        likeText.innerHTML = ` 좋아요 ${likeCount + 1}개 `;
                    }
                } else {
                    alert("좋아요 입력은 로그인이 필요합니다.");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
            }
        }
    }
    function removeLike(event) {
        const httpRequest = sendData(`type=removePostingLike&postingPk=${postingPk}&username=${username}`);
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                // 이상 없음, 응답 받았음
                success = Boolean(httpRequest.responseText);
                if (success) {
                    likeBtn.classList.remove("liked");
                    const likeInnerHTML = likeText.innerHTML;
                    const likeTextParse = likeInnerHTML.split("개")[0].split(" ");
                    const likeCount = Number(likeTextParse[likeTextParse.length - 1]);
                    likeText.innerHTML = ` 좋아요 ${likeCount - 1}개 `;
                } else {
                    alert("좋아요 입력은 로그인이 필요합니다.");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
            }
        }
    }
    centerPanel.addEventListener("dblclick", addLike);
    like.addEventListener("dblclick", addLike);
    //! 로그인 구현 후 좋아요를 달았는지 아닌지 서버데이터로 미리 확인처리하기!!
    /* 즉각적,동적인 데이터 전송은 form에 action을 안달고 할 수 있어보인다
    */
    likeBtn.addEventListener("click", function () {
        if (!Array(...likeBtn.classList).includes("liked")) {
            addLike();
        } else {
            removeLike();
        }
    });

    //* x3
    // 본문 첫줄만 보이도록 자르고 나머지는 안보이게 줄바꿈 넣기
    let contentBox = posting.querySelector(".posting__x3__content__p"),
        originContent = contentBox.querySelector("p").innerHTML,
        foldTopBtn = posting.querySelector(".posting__x3__content__fold-top"),
        foldBottomBtn = posting.querySelector(".posting__x3__content__fold-bottom"),
        fontSize = 16;
    foldBottomBtn.classList.add("none");
    let charLimit = (postingWidth - 61) / fontSize;
    function contentCut() {
        let firstLine = originContent.split("<br")[0];
        if (firstLine.length > charLimit) {
            firstLineEdit = originContent.slice(0, charLimit);
            contentBox.querySelector("p").innerHTML = firstLineEdit + "<br>" + originContent.slice(charLimit, -1);
            firstLine = contentBox.querySelector("p").innerHTML.split("<br")[0];
        } // 2021.10.05 위 코드박스는 유효한 코드라는것을 확인함.
        let content = contentBox.querySelector("p").innerHTML;
        let a = content.split("<br>")[0];
        let b = content.split("<br>").slice(1, -1).join("");
        let firstLineContent = a + "<br> <br>" + b;
        contentBox.querySelector("p").innerHTML = firstLineContent;

        foldTopBtn.addEventListener("click", function (event) {
            contentBox.classList.remove("posting__x3__content__p");
            contentBox.classList.add("content-opened");
            contentBox.querySelector("p").innerHTML = originContent;
            foldTopBtn.classList.add("none");
            foldBottomBtn.classList.remove("none");
        })
        foldBottomBtn.addEventListener("click", function (event) {
            contentBox.classList.add("posting__x3__content__p");
            contentBox.classList.remove("content-opened");
            contentBox.querySelector("p").innerHTML = firstLineContent;
            foldTopBtn.classList.remove("none");
            foldBottomBtn.classList.add("none");
        })
    }
    if (originContent.includes("<br")) {
        contentCut();
    } else if (originContent.length > charLimit) {
        contentCut(); //본문 요약본이 올바르게 만들어지지 않는 오류 해결
    } else {
        foldTopBtn.classList.add("none");
    }
    //*x4x5
    let x6Margin = posting.querySelector(".posting__x6-margin");
    function contentFold(box, btn, limit, x, xObj) {
        if (box.offsetHeight > limit) {
            xObj.classList.add("flip-btn-space")
            box.classList.add(`${x}max-hight`);
            btn.addEventListener("click", function (event) {
                if (box.classList.contains(`${x}max-hight`)) {
                    box.classList.remove(`${x}max-hight`);
                    btn.classList.add("btn-flip");
                } else {
                    box.classList.add(`${x}max-hight`);
                    btn.classList.remove("btn-flip");
                }
            })
            x6Margin.classList.add("none")
        } else {
            // 아니면 더보기 버튼을 없앤다.
            btn.classList.add("none")
        }
    }
    //* x4
    let x4Tags = posting.querySelectorAll(".posting__x4__box__tag"),
        x4Box = posting.querySelector(".posting__x4__box"),
        x4FoldBtn = posting.querySelector(".posting__x4__fold-down"),
        x4 = posting.querySelector(".posting__x4");

    for (let tag of x4Tags) {
        let kind = tag.getAttribute("kind");
        coloring(tag, kind);
    }
    contentFold(x4Box, x4FoldBtn, 85, "x4", x4)//태그가 두 줄을 초과하면 접기

    //* x5
    let x5Tags = posting.querySelectorAll(".posting__x5__box__tag"),
        x5Box = posting.querySelector(".posting__x5__box"),
        x5FoldBtn = posting.querySelector(".posting__x5__fold-down"),
        x5 = posting.querySelector(".posting__x5");

    for (let tag of x5Tags) {
        let kind = tag.getAttribute("kind");
        coloring(tag, kind);
    }
    contentFold(x5Box, x5FoldBtn, 85, "x5", x5)//태그가 두 줄을 초과하면 접기
    // *x4x5
    let x4BtnTag = posting.querySelector(".posting__x4__box__state"),
        x5BtnTag = posting.querySelector(".posting__x5__box__state");

    x5.classList.add("none");
    x4BtnTag.addEventListener("click", function (event) {
        x4.classList.add("none");
        x5.classList.remove("none");

        if (x5.classList.contains("flip-btn-space")) {
            x6Margin.classList.add("none")
        } else {
            x6Margin.classList.remove("none")
        }
    })
    x5BtnTag.addEventListener("click", function (event) {
        x4.classList.remove("none");
        x5.classList.add("none");

        if (x4.classList.contains("flip-btn-space")) {
            x6Margin.classList.add("none")
        } else {
            x6Margin.classList.remove("none")
        }
    })
    // *x6
    let commentOpenBtn = posting.querySelector(".posting__x6__btn");
    let commentsCount = commentOpenBtn.getAttribute("comments");
    if (commentsCount == "0") {
        commentOpenBtn.classList.add("none");
    }

    let comments = posting.querySelector(".posting__x6__comment");
    let content = commentOpenBtn.innerHTML;
    commentOpenBtn.addEventListener("click", function (event) {
        if (comments.classList.contains("none")) {
            comments.classList.remove("none");
            commentOpenBtn.innerHTML = "댓글창 접기";
        } else {
            comments.classList.add("none");
            commentOpenBtn.innerHTML = content;
        }
    })

    let commentLikeBtns = posting.querySelectorAll(".posting__x6__comment__info__like-btn"),
        replyLikeBtns = posting.querySelectorAll(".posting__x6__comment__reply__info__like-btn");

    function commentLikeBtnfunc(btns) {
        for (let btn of btns) {
            let commentPk = btn.getAttribute("commentPk");
            btn.addEventListener("click", function (event) {
                if (btn.classList.contains("commentLiked")) {
                    // Like 제거!
                    httpRequest = sendData(`type=removeCommentLike&commentPk=${commentPk}&username=${username}`);
                    httpRequest.onreadystatechange = function () {
                        if (httpRequest.readyState === XMLHttpRequest.DONE) {
                            // 이상 없음, 응답 받았음
                            success = Boolean(httpRequest.responseText);
                            if (success) {
                                btn.classList.remove("commentLiked");
                                const likeText = btn.parentElement.querySelector(".posting__x6__comment__info__like");
                                const likeInnerHTML = likeText.innerHTML;
                                const likeTextParse = likeInnerHTML.split("개")[0].split(" ");
                                const likeCount = Number(likeTextParse[likeTextParse.length - 1]);
                                likeText.innerHTML = ` 좋아요 ${likeCount - 1}개 `;
                            }
                        }
                    }
                } else {
                    // Like 입력!
                    httpRequest = sendData(`type=commentLike&commentPk=${commentPk}&username=${username}`);
                    httpRequest.onreadystatechange = function () {
                        if (httpRequest.readyState === XMLHttpRequest.DONE) {
                            // 이상 없음, 응답 받았음
                            login = Boolean(httpRequest.responseText);
                            if (login) {
                                btn.classList.add("commentLiked");
                                const likeText = btn.parentElement.querySelector(".posting__x6__comment__info__like");
                                const likeInnerHTML = likeText.innerHTML;
                                const likeTextParse = likeInnerHTML.split("개")[0].split(" ");
                                const likeCount = Number(likeTextParse[likeTextParse.length - 1]);
                                likeText.innerHTML = ` 좋아요 ${likeCount + 1}개 `;
                            } else {
                                alert("좋아요 입력은 로그인이 필요합니다.");
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                return;
                            }
                        }
                    }
                }
            })
        }
    }
    function replyLikeBtnfunc(btns) {
        for (let btn of btns) {
            let replyPk = btn.getAttribute("replyPk");
            btn.addEventListener("click", function (event) {
                if (btn.classList.contains("commentLiked")) {
                    // Like 제거!
                    httpRequest = sendData(`type=removeReplyLike&replyPk=${replyPk}&username=${username}`);
                    httpRequest.onreadystatechange = function () {
                        if (httpRequest.readyState === XMLHttpRequest.DONE) {
                            // 이상 없음, 응답 받았음
                            success = Boolean(httpRequest.responseText);
                            if (success) {
                                btn.classList.remove("commentLiked"); // 클래스명은 commentLiked그대로 쓴다
                                const likeText = btn.parentElement.querySelector(".posting__x6__comment__reply__info__like");
                                const likeInnerHTML = likeText.innerHTML;
                                const likeTextParse = likeInnerHTML.split("개")[0].split(" ");
                                const likeCount = Number(likeTextParse[likeTextParse.length - 1]);
                                likeText.innerHTML = ` 좋아요 ${likeCount - 1}개 `;
                            }
                        }
                    }
                } else {
                    // Like 입력!
                    httpRequest = sendData(`type=replyLike&replyPk=${replyPk}&username=${username}`);
                    httpRequest.onreadystatechange = function () {
                        if (httpRequest.readyState === XMLHttpRequest.DONE) {
                            // 이상 없음, 응답 받았음
                            login = Boolean(httpRequest.responseText);
                            if (login) {
                                btn.classList.add("commentLiked"); // 클래스명은 commentLiked그대로 쓴다
                                const likeText = btn.parentElement.querySelector(".posting__x6__comment__reply__info__like");
                                const likeInnerHTML = likeText.innerHTML;
                                const likeTextParse = likeInnerHTML.split("개")[0].split(" ");
                                const likeCount = Number(likeTextParse[likeTextParse.length - 1]);
                                likeText.innerHTML = ` 좋아요 ${likeCount + 1}개 `;
                            } else {
                                alert("좋아요 입력은 로그인이 필요합니다.");
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                return;
                            }
                        }
                    }
                }
            })
        }
    }
    commentLikeBtnfunc(commentLikeBtns);
    replyLikeBtnfunc(replyLikeBtns);

    let replyBtns = posting.querySelectorAll(".posting__x6__comment__info__reply-btn"),
        replyReplyBtns = posting.querySelectorAll(".posting__x6__comment__reply__info__reply-btn");

    function replyBtnProcess(btns, prefix = true) {
        Array(...btns).map(function (replyBtn) {
            let replyForm = replyBtn.parentElement.nextElementSibling.querySelector("form");

            replyBtn.addEventListener("click", function (event) {
                if (replyForm.classList.contains("none")) {
                    replyForm.classList.remove("none");
                    replyBtn.innerHTML = "작성취소";
                    let textArea = replyForm.querySelector("div").querySelector("textarea");
                    textArea.value = '';
                    if (prefix) {
                        let targetUserName = replyBtn.parentElement.querySelector("a .posting__x6__comment__reply__info__created_by").innerHTML.trim();
                        textArea.value = `Re.${targetUserName} `;
                    }
                } else {
                    replyForm.classList.add("none");
                    replyBtn.innerHTML = "답글작성";
                }
            })
        })
    }
    replyBtnProcess(replyBtns, prefix = false);
    replyBtnProcess(replyReplyBtns);

    //------------- Comment , Reply Functional Code ------------------------
    let commentInputSection = posting.querySelector(".posting__x7__comment-input");
    let commentText = commentInputSection.querySelector("textarea");
    let commentSubmit = commentInputSection.querySelector("div");

    commentSubmit.addEventListener("click", function (event) {
        let commentTextValue = commentText.value
        commentText.value = ""
        commentText.style.height = "47px";
        httpRequest = sendData(`type=comment&postingPk=${postingPk}&username=${username}&text=${commentTextValue}`);
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                // 이상 없음, 응답 받았음
                data = httpRequest.responseText;
                if (data) {
                    //! 댓글 추가
                    let [name, imageUrl, userPk, commentPk] = data.split("&$")
                    let [info, main] = makeComment(commentTextValue, name, username, userPk, commentPk, imageUrl, comments, posting)
                    let commentBox = posting.querySelector(".posting__x6__comment");
                    commentBox.append(info);
                    commentBox.append(main);

                    let infoTextParse = content.split("개")[0].split(" ");
                    let commentCountNumber = Number(infoTextParse[infoTextParse.length - 1]);
                    content = ` 댓글 ${commentCountNumber + 1}개 모두 보기 `; // 저 위에 content 변수가 있음
                    console.log("앙앙")

                    if (commentBox.classList.contains("none")) {
                        commentOpenBtn.click();
                        main.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    alert("댓글 작성은 로그인이 필요합니다.")
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
            }
        }
    })

    let replyForms = posting.querySelectorAll(".reply-form");
    for (let replyForm of replyForms) {
        let replySubmit = replyForm.querySelector("div");
        let commentPk = replySubmit.getAttribute("commentPk");
        replySubmit.addEventListener("click", function (event) {
            let replyText = replyForm.querySelector("textarea");
            httpRequest = sendData(`type=reply&commentPk=${commentPk}&username=${username}&text=${replyText.value}`)
            httpRequest.onreadystatechange = function () {
                let commentBox = posting.querySelector(".posting__x6__comment");
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    // 이상 없음, 응답 받았음
                    data = httpRequest.responseText;
                    if (data) {
                        //! 답글 추가
                        let [name, imageUrl, userPk, replyPk, commentPk] = data.split("&$");
                        let replyBox = makeReply(replyText, name, username, userPk, replyPk, commentPk, imageUrl, comments, posting);
                        let mark = false;
                        for (let commentInfo of posting.querySelectorAll(".posting__x6__comment__info")) {
                            let inCommentPk = commentInfo.querySelector(".posting__x6__comment__info__like-btn").getAttribute("commentPk");
                            if (mark) {
                                commentBox.insertBefore(replyBox, commentInfo);
                                mark = false;
                            }
                            if (Number(inCommentPk) === Number(commentPk)) {
                                //이제 다음번 commentInfo 위에다가 삽입하면 된다!
                                mark = true;
                            }
                        }
                        if (mark) {
                            // for문이 끝났는데도 마크가 살아있다 = 아래에 코멘트가 더 없다 = 그냥 마지막에 넣으면 된다.
                            commentBox.append(replyBox);
                        }
                        replyBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        alert("댓글 작성은 로그인이 필요합니다.")
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        return;
                    }
                }
            }
        })
    }
    let commentInfos = posting.querySelectorAll(".posting__x6__comment__info");
    for (let commentInfo of commentInfos) {
        let inLikeBtn = commentInfo.querySelector(".posting__x6__comment__info__like-btn ");
        let targetCommentPk = inLikeBtn.getAttribute("commentPk");
        let deleteBtn = commentInfo.querySelector(".posting__x6__comment__info__delete-btn");
        deleteBtn.addEventListener("click", function (event) {
            let httpRequest = sendData(`type=removeComment&commentPk=${targetCommentPk}&username=${username}`);
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    // 이상 없음, 응답 받았음
                    success = Boolean(httpRequest.responseText);
                    if (success) {
                        let _ = alert("댓글이 삭제되었습니다.");
                        location.reload();
                    } else {
                        alert("잘못된 접근입니다. 로그인하지 않았거나, 당신이 작성한 댓글이 아닙니다.");
                        return;
                    }
                }
            }
        })
    }
    let replys = posting.querySelectorAll(".posting__x6__comment__reply");
    for (let reply of replys) {
        let replyInfo = reply.querySelector(".posting__x6__comment__reply__info");
        let replyPk = replyInfo.querySelector(".posting__x6__comment__reply__info__like-btn").getAttribute("replypk");
        let replyDeleteBtn = replyInfo.querySelector(".posting__x6__comment__reply__info__delete-btn");
        replyDeleteBtn.addEventListener("click", function (event) {
            let httpRequest = sendData(`type=removeReply&replyPk=${replyPk}&username=${username}`);
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    // 이상 없음, 응답 받았음
                    success = Boolean(httpRequest.responseText);
                    if (success) {
                        reply.remove();
                    } else {
                        alert("잘못된 접근입니다. 로그인하지 않았거나, 당신이 작성한 답글이 아닙니다.");
                        return;
                    }
                }
            }
        })
    }
}

function postingScripting() {
    //! 포스팅이 하나여도 괜찮다!!
    let postings = Array(...document.querySelectorAll(".posting"));

    for (let posting of postings) {
        postingScript(posting);
    }
}
// 코드 상태 심각하고 불러올 이미지도 많고 그래서 꼭 DOM로드 후 실행해야 한다!!
window.addEventListener('load', postingScripting);
