window.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "1";
  const exit_btn = document.querySelector(".exit_account");

  if (exit_btn) {
    exit_btn.addEventListener("click", () => {
      document.cookie = "token=; Max-Age=0";
      window.location.reload();
    });
  }

  // const search_input = document.querySelector(".main_search_input");

  // if (search_input) {
  //     search_input.addEventListener("input", async (e) => {
  //         const search = await fetch("/search", {
  //             method: 'POST',
  //             headers: {
  //                Accept: "application/json",
  //                "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({value: e.target.value})
  //         })
  //         const res = await search.json()
  //         console.log(res)
  //     })
  // }
});
