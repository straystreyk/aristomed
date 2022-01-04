window.addEventListener("DOMContentLoaded", () => {
    const editble = document.querySelectorAll(".editble");
    const popup = document.createElement("div");
    const popup_wrapper = document.createElement("div");
    const edit_area = document.createElement("textarea");
    const buttons = document.createElement("div");
    const weight_btn = document.createElement("button");
    const p_btn = document.createElement("button");
    const nbsp_btn = document.createElement("button");
    const edit_btn = document.createElement("button");

    buttons.classList.add("buttons")
    weight_btn.classList.add("weight_btn")
    p_btn.classList.add("p_btn")
    nbsp_btn.classList.add("p_letter_btn")
    edit_btn.classList.add("edit_btn")
    edit_area.classList.add("edit_area")
    popup.classList.add("text_update_popup")
    popup_wrapper.classList.add("popup_wrapper")
    edit_btn.innerText = "Изменить"
    weight_btn.innerText = "Жирный шрифт"
    p_btn.innerText = "С новой строки"
    nbsp_btn.innerText = "Неразрывный пробел"
    buttons.append(weight_btn)
    buttons.append(p_btn)
    buttons.append(nbsp_btn)
    popup_wrapper.append(buttons)
    popup_wrapper.append(edit_area)
    popup_wrapper.append(edit_btn)
    popup.append(popup_wrapper)

    document.body.append(popup)

    const edit = (el) => {
        edit_area.value = el.innerHTML
        edit_area.dataset.name = el.dataset.name
        edit_area.dataset.page = el.dataset.page
    }

    const accept = async () => {
        try {
            const update_text = await fetch("/text_update", {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: edit_area.dataset.name,
                    value: edit_area.value,
                    page: edit_area.dataset.page,
                    location: window.location.href
                })
            });

            const res = await update_text.json()
            window.location.reload()
            popup.classList.remove("active")
            edit_area.dataset.name = ""
            edit_area.dataset.page = ""
            edit_area.value = ""
        } catch (e) {
            console.log(e)
        }
    }

    edit_btn.addEventListener("click", accept)

    popup.addEventListener("click", (e) => {
        if (e.target.classList.contains("active")) {
            e.target.classList.remove("active")
        }
    })

    editble.forEach((el) => {
        el.classList.add("editble_active")
        el.addEventListener("dblclick", () => {
            popup.classList.add("active")
            edit(el)
        })
    })

    //работа с попапом
    const matcher = (left_tag, right_tag) => {
        let current = edit_area.value.slice(edit_area.selectionStart, edit_area.selectionEnd);
        console.log(current)
        if (current.includes(left_tag) && current.includes(right_tag)) {
            current = current.slice(left_tag.length, current.length - right_tag.length);
        } else {
            current = left_tag + current.substring(0, current.length) + right_tag
        }
        edit_area.value = edit_area.value.slice(0, edit_area.selectionStart)
            + current + edit_area.value.slice(edit_area.selectionEnd, edit_area.value.length)
    }

    weight_btn.addEventListener("click", () => matcher("<b>", "</b>"))
    p_btn.addEventListener("click", () => matcher("<p>", "</p>"))
    nbsp_btn.addEventListener("click", () => matcher("&nbsp;", ""))
})