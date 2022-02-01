import { observer } from "../plugins/instersection.js";

window.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "1";
  const burger = document.querySelector(".burger");
  const sub_menu = document.querySelector(".sub_menu");
  const exit_btn = document.querySelector(".exit_account");

  if (burger)
    burger.addEventListener("click", () => burger.classList.toggle("active"));
  if (sub_menu) sub_menu.addEventListener("click", (e) => e.stopPropagation());

  if (exit_btn) {
    exit_btn.addEventListener("click", () => {
      document.cookie = "token=; Max-Age=0";
      window.location.reload();
    });
  }

  //intersection
  const all_images = document.querySelectorAll("img");
  all_images.forEach((i) => {
    observer.observe(i);
  });

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
