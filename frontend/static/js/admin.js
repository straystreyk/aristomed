window.addEventListener("DOMContentLoaded", () => {
    const editble = document.querySelectorAll(".editble");
    const popup = document.createElement("div");
    const edit_area = document.createElement("textarea");
    const editBtn = document.createElement("button");
    editBtn.classList.add("editBtn")
    edit_area.classList.add("edit_area")
    popup.classList.add("text_update_popup")
    editBtn.innerText = "edit"
    popup.append(edit_area)
    popup.append(editBtn)
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
                    page: edit_area.dataset.page
                })
            });

            const res = await update_text.json()
            popup.classList.remove("active")
            edit_area.dataset.name = ""
            edit_area.dataset.page = ""
            edit_area.value = ""
        } catch (e) {
            console.log(e)
        }
    }

    editBtn.addEventListener("click", accept)
    popup.addEventListener("click", (e) => {
        if (e.target.classList.contains("active")) {
            e.target.classList.remove("active")
        }
    })

    editble.forEach((el) => {
        el.addEventListener("mouseover", () => {
            el.style.border = "2px solid red"
        })
        el.addEventListener("mouseout", () => {
            el.style.border = ""
        })
        el.addEventListener("dblclick", () => {
            popup.classList.add("active")
            edit(el)
        })
    })
})