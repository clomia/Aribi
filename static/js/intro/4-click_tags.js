window.addEventListener('load', function () {
    // DOM 데이터로 DOM을 만드는거라 필요
    let form = document.querySelector(".tags"),
        checkboxList = [...document.querySelector(".tagbox__constituent").childNodes, ...document.querySelector(".tagbox__flavor").childNodes],
        table = document.querySelector(".selected"),
        tagBoxField = document.querySelector(".tagbox__field"),
        searchBtn = document.querySelector(".selected__search-btn"),
        deleteBtn = document.querySelector(".selected__delete-btn"),
        underBar = document.querySelector(".under-bar");
    tagList = document.querySelectorAll(".tag");

    let checkboxMap = new Object();

    function checkboxMapSetting(checkboxEle) {
        let identifier = checkboxEle.classList[0];
        checkboxMap[identifier] = checkboxEle;
    }
    checkboxList.forEach(checkboxMapSetting);

    function checkControll(tag, check_value) {
        let identifier = tag.classList[0];
        let checkbox = checkboxMap[identifier];
        checkbox.checked = check_value;
    }

    function setColorClass(targetBtn, colorName) {
        targetBtn.className = "selected__search-btn";
        targetBtn.classList.add("spec-" + colorName);
    }

    function drop(event) {
        checkControll(event.target, false);

        event.target.classList.remove("raise");
        tagBoxField.insertBefore(event.target, tagBoxField.firstChild);
        event.target.removeEventListener("mousedown", drop);
        event.target.addEventListener("mousedown", raise);

        setColorClass(searchBtn, table.children[1].classList[2]);
        setColorClass(deleteBtn, table.children[table.children.length - 3].classList[2]);

        // 테이블에 태그가 없다면 버튼을 없앤다
        if (table.children.length === 3) {
            searchBtn.classList.add("none");
            deleteBtn.classList.add("none");
            underBar.classList.add("table-empty");
        }
    }

    function raise(event) {
        // 테이블에 태그가 없다면 none먼저 없애고 진행
        if (table.children.length === 3) {
            searchBtn.classList.remove("none");
            deleteBtn.classList.remove("none");
            underBar.classList.remove("table-empty");
        }

        checkControll(event.target, true);

        event.target.classList.add("raise");

        table.insertBefore(event.target, table.children[1]);
        event.target.removeEventListener("mousedown", raise);
        event.target.addEventListener("mousedown", drop);

        setColorClass(searchBtn, event.target.classList[2]);
        setColorClass(deleteBtn, table.children[table.children.length - 3].classList[2]);
    }

    tagList.forEach(element => {
        element.addEventListener("mousedown", raise);
    });

    function eraser(event) {
        let targets = table.querySelectorAll(".tag");
        targets.forEach(ele => checkControll(ele, false));
        targets.forEach(ele => ele.classList.remove("raise"));
        targets.forEach(ele => tagBoxField.insertBefore(ele, tagBoxField.firstChild));
        targets.forEach(ele => ele.removeEventListener("mousedown", drop));
        targets.forEach(ele => ele.addEventListener("mousedown", raise));

        setColorClass(searchBtn, undefined);
        setColorClass(deleteBtn, undefined);

        // 버튼을 없앤다
        searchBtn.classList.add("none");
        deleteBtn.classList.add("none");
        underBar.classList.add("table-empty");
    }

    function submit(event) {
        form.submit();
        // 채크해둔게 브라우저 캐시로 남아 있다 버그마냥..
        // 근데 또 신기하게 아래 코드가 먹힌다ㅋㅋ 이렇게 submit이후에 처리해주었다.
        checkboxList.forEach(checkbox => { checkbox.checked = false })
    }

    deleteBtn.addEventListener("mousedown", eraser);

    searchBtn.addEventListener("mousedown", submit);
})