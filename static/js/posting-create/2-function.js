function resize(obj) {
    obj.style.height = "31px";
    obj.style.height = obj.scrollHeight + "px";
}

function numberMaxLength(e) {

    if (e.value.length > e.maxLength) {

        e.value = e.value.slice(0, e.maxLength);
        if (Number(e.value) >= 100) {
            e.value = "0"
        }
    }

}