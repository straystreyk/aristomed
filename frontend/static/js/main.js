window.addEventListener("DOMContentLoaded", () => {
    const exit_btn = document.querySelector(".exit_account");
    if (exit_btn) {
        exit_btn.addEventListener("click", () => {
            document.cookie = "token=; Max-Age=0"
            window.location.reload()
        })
    }
})