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
        likeBtn = posting.querySelector(".posting__x2__like-btn");
    function addLike(event) {
        // like는 효과 liked는 구분자
        like.classList.add("like");
        setTimeout(function () {
            like.classList.remove("like");
        }, 900);
        if (Array(...likeBtn.classList).includes("liked")) {
            return;
        } else {
            likeBtn.classList.add("liked");
        }
        const httpRequest = sendData(`type=postingLike&postingPk=${postingPk}&username=${username}`);
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                // 이상 없음, 응답 받았음
                login = Boolean(httpRequest.responseText);
                if (!login) {
                    alert("좋아요 입력은 로그인 후 이용해주세요.");
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
                } else {
                    alert(success); // 응답을 그대로 표기
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

    function likeBtnfunc(btns) {
        for (let btn of btns) {
            btn.addEventListener("click", function (event) {
                if (btn.classList.contains("commentLiked")) {
                    btn.classList.remove("commentLiked");
                } else {
                    btn.classList.add("commentLiked");
                }
            })
        }
    }
    likeBtnfunc(commentLikeBtns);
    likeBtnfunc(replyLikeBtns);

    let replyBtns = posting.querySelectorAll(".posting__x6__comment__info__reply-btn"),
        replyReplyBtns = posting.querySelectorAll(".posting__x6__comment__reply__info__reply-btn");

    function replyBtnProcess(btns) {
        Array(...btns).map(function (replyBtn) {
            let replyForm = replyBtn.parentElement.nextElementSibling.querySelector("form");

            replyBtn.addEventListener("click", function (event) {
                if (replyForm.classList.contains("none")) {
                    replyForm.classList.remove("none");
                    replyBtn.innerHTML = "작성취소";
                    let targetUserName = replyBtn.parentElement.firstChild.nextElementSibling.nextElementSibling.innerHTML.trim();
                    let textArea = replyForm.querySelector("div").querySelector("textarea");
                    textArea.value = `[${targetUserName}에게 답장]   `;
                } else {
                    replyForm.classList.add("none");
                    replyBtn.innerHTML = "답글작성";
                }
            })
        })
    }
    replyBtnProcess(replyBtns);
    replyBtnProcess(replyReplyBtns);
}

function postingScripting() {
    //! 포스팅이 하나여도 괜찮다!!
    let postings = Array(...document.querySelectorAll(".posting"));

    for (let posting of postings) {
        postingScript(posting);
    }
}
// 코드 무겁고 불러올 이미지도 많고 그래서 꼭 DOM로드 후 실행해야 한다!!
window.addEventListener('load', postingScripting);
