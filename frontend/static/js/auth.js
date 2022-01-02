window.addEventListener("DOMContentLoaded", () => {
    const auth_form = document.querySelector(".auth-form");
    const all_inputs = document.querySelectorAll(".auth_input");

    const get_data = () => {
        const data = {}
        all_inputs.forEach(el => {
            data[el.name] = el.value
        })
        return data
    }

    const clear_inputs = () => {
        all_inputs.forEach(el => {
            el.value = ""
        })
    }

    auth_form.addEventListener("submit", async (e) => {
        e.preventDefault()
        try {
            const login = await fetch("/admin/auth/login", {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(get_data())
            });

            const res = await login.json()
            document.cookie = `token=${res.token}; path=/`
            clear_inputs()
            window.location.reload()
        } catch (e) {
            console.log(e)
        }
    })

    // Готовая регистрация
    // const register_btn = document.querySelector(".register_btn");
    // register_btn.addEventListener("click", async (e) => {
    //     e.preventDefault()
    //     try {
    //         const login = await fetch("/admin/auth/registration", {
    //             method: "post",
    //             headers: {
    //                 Accept: "application/json",
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(get_data())
    //         });
    //
    //         const res = await login.json()
    //         console.log(res)
    //         clear_inputs()
    //     } catch (e) {
    //         console.log(e)
    //     }
    // })
})