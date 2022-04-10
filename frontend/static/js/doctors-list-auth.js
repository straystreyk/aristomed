window.addEventListener("DOMContentLoaded", () => {
  const deleteResource = document.querySelectorAll(".deleteResource");
  const modalMUI = document.querySelector(".modal");
  const modal = M.Modal.init(modalMUI);

  deleteResource.forEach((el) => {
    el.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        const res = await fetch(window.url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: e.target.dataset.id }),
        });
        const { message, redirect } = await res.json();
        modal.el.firstElementChild.innerHTML = `
        <div>
            ${message}
        </div>
        <div>
            <a class="waves-effect btn-small" href="${redirect}">Вернуться к списку</a>
        </div>
        `;
        modal.open();
      } catch (e) {
        console.log(e.message);
      }
    });
  });
});
