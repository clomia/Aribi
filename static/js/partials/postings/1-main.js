function coloring(tag, kind) {
    switch (kind) {
        case "액체":
            tag.classList.add("liquid")
            break;
        case "재료":
            tag.classList.add("ingredient")
            break;
        case "용품":
            tag.classList.add("equipment")
            break;
        case "과일맛":
            tag.classList.add("fruit")
            break;
        case "식물맛":
            tag.classList.add("plant")
            break;
        case "기본맛":
            tag.classList.add("teste")
            break;
        case "향신료맛":
            tag.classList.add("spice")
            break;
        case "입안 감촉":
            tag.classList.add("texture")
            break;
        case "냄새":
            tag.classList.add("scent")
            break;
        case "색감":
            tag.classList.add("color")
            break;
        case "기타 특징":
            tag.classList.add("other")
            break;
        default:
            break;
    }
}

window.addEventListener('load', function () {
    let postings = Array(...document.querySelectorAll(".posting"));
    // 아래 코드도 무겁고 불러올 이미지도 많고 그래서 꼭 DOM로드 후 실행해야 한다!!

    for (let posting of postings) {
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
                if (slider.scrollLeft >= postingWidth * imageCount - postingWidth) {
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
        function likeAction(event) {
            like.classList.add("like");
            likeBtn.classList.add("liked");
            //! 함수 넣는 자리!!!
            console.log("좋아요 입력!!!")
            //!--------------------
            setTimeout(function () {
                like.classList.remove("like");
            }, 900);
        }
        centerPanel.addEventListener("dblclick", likeAction);
        like.addEventListener("dblclick", likeAction);
        //! 로그인 구현 후 좋아요를 달았는지 아닌지 서버데이터로 미리 확인처리하기!!
        /* 즉각적,동적인 데이터 전송은 form에 action을 안달고 할 수 있어보인다
        */
        likeBtn.addEventListener("click", function () {
            if (!Array(...likeBtn.classList).includes("liked")) {
                likeAction();
                likeBtn.classList.add("liked");
            } else {
                likeBtn.classList.remove("liked");
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
        if (originContent.includes("<br")) {
            let charLimit = (postingWidth - 61) / fontSize;
            let firstLine = originContent.split("<br")[0];
            if (firstLine.length > charLimit) {
                firstLineEdit = originContent.slice(0, charLimit);
                contentBox.querySelector("p").innerHTML = firstLineEdit + "<br>" + originContent.slice(charLimit, -1);
                firstLine = contentBox.querySelector("p").innerHTML.split("<br")[0];
            }
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
        } else {
            foldTopBtn.classList.add("none");
        }

        //* x4
        let x4Tags = posting.querySelectorAll(".posting__x4__box__tag"),
            x4Box = posting.querySelector(".posting__x4__box"),
            x4FoldBtn = posting.querySelector(".posting__x4__fold-down");

        for (let tag of x4Tags) {
            let kind = tag.getAttribute("kind");
            coloring(tag, kind);
        }

        if (x4Box.offsetHeight > 85) {
            // 태그가 두 줄 이상이면 더보기 버튼을 추가한다
            x4Box.classList.add("x4max-hight");
            x4FoldBtn.addEventListener("click", function (event) {
                if (x4Box.classList.contains("x4max-hight")) {
                    x4Box.classList.remove("x4max-hight");
                    x4FoldBtn.classList.add("btn-flip");
                } else {
                    x4Box.classList.add("x4max-hight");
                    x4FoldBtn.classList.remove("btn-flip");
                }
            })
        } else {
            // 아니면 더보기 버튼을 없앤다.
            x4FoldBtn.classList.add("none")
        }
    }
})
