// 서버에서 받은 정보로 Tag를 렌더링합니다

let contentList = document.querySelectorAll(".content"),
    classList = document.querySelectorAll(".class"),
    typeList = document.querySelectorAll(".type"),
    alcoholList = document.querySelectorAll(".alcohol"),
    pkList = document.querySelectorAll(".pk"),
    constituent = document.querySelector(".tagbox__constituent"),
    flavor = document.querySelector(".tagbox__flavor"),
    field = document.querySelector(".tagbox__field");

function zip(arrays) {
    return Array.apply(null, Array(arrays[0].length)).map(function (_, i) {
        return arrays.map(function (array) { return array[i] })
    });
}
// collection은 [content,class,pk]가 들어있는 Array입니다.
let collection = zip([contentList, classList, typeList, alcoholList, pkList]);

function toContent(array) {
    return array.map(dom => dom.innerHTML);
}
function dict(collection) {
    // python에서 보낸 데이터가 기존 dict와 유사한 obj로 최종 변환됩니다
    let obj = new Object();
    [obj.content, obj.class, obj.type, _, _] = collection;
    if (collection[3] === "True") {
        obj.alcohol = true;
    } else if (collection[3] === "False") {
        obj.alcohol = false;
    }
    obj.pk = parseInt(collection[4])
    return obj;
}

let constituentCounter = 0;
let flavorCounter = 0;

function createTag(data) {
    function createAttr(cssClass, classifier) {
        let ID = classifier + data.pk
        //* 사용자가 접하는 div 생성
        let tag = document.createElement("div");
        tag.classList.add(ID);
        tag.innerHTML = data.content;
        tag.classList.add("tag");
        tag.classList.add(cssClass);
        tag.title = data.type
        if (data.alcohol) {
            tag.classList.add("alcohol");
            tag.title = "술"
        }
        //* 데이터 전송을 위한 input 생성 
        let ele = document.createElement("input");
        ele.classList.add(ID);
        ele.type = "checkbox";
        if (classifier === "Constituent") {
            constituent.appendChild(ele);
        } else if (classifier === "FlavorTag") {
            flavor.appendChild(ele);
        }
        field.appendChild(tag)
        ele.name = "tag";
        ele.value = JSON.stringify({
            class: classifier,
            pk: data.pk,
        })
        // input 객체는 안보이도록 함
        ele.classList.add("none")
    }

    switch (data.type) {
        case "액체":
            createAttr("liquid", "Constituent")
            break;
        case "재료":
            createAttr("ingredient", "Constituent")
            break;
        case "용품":
            createAttr("equipment", "Constituent")
            break;
        case "과일맛":
            createAttr("fruit", "FlavorTag")
            break;
        case "식물맛":
            createAttr("plant", "FlavorTag")
            break;
        case "기본맛":
            createAttr("teste", "FlavorTag")
            break;
        case "향신료맛":
            createAttr("spice", "FlavorTag")
            break;
        case "입안 감촉":
            createAttr("texture", "FlavorTag")
            break;
        case "냄새":
            createAttr("scent", "FlavorTag")
            break;
        case "색감":
            createAttr("color", "FlavorTag")
            break;
        case "기타 특징":
            createAttr("other", "FlavorTag")
            break;
        default:
            break;
    }
}



collection.map(toContent).map(dict).forEach(createTag);