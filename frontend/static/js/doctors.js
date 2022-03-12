window.addEventListener("DOMContentLoaded", () => {
  const select = document.querySelector("select");
  const pags = document.querySelectorAll(".pagination_bullet");
  const instances = M.FormSelect.init(select, { transition: 0 });
  const urlParams = new URLSearchParams(window.location.search);

  if (instances) {
    instances.el.addEventListener("change", (e) => {
      setTimeout(() => {
        if (!window.location.href.includes("medicine_direction")) {
          window.location.href = `?medicine_direction=${e.target.value}`;
        } else {
          const number = urlParams.get("medicine_direction");
          window.location.href = window.location.href.replace(
            `medicine_direction=${number}`,
            `medicine_direction=${e.target.value}`
          );
        }
      }, 150);
    });
  }

  if (pags.length) {
    pags.forEach((el) => {
      el.addEventListener("click", (e) => {
        if (!window.location.href.includes("page")) {
          if (window.location.href.includes("?")) {
            window.location.href =
              window.location.href + `&page=${e.target.value}`;
          } else {
            window.location.href =
              window.location.href + `?&page=${e.target.value}`;
          }
        } else {
          const number = urlParams.get("page");
          window.location.href = window.location.href.replace(
            `page=${number}`,
            `page=${e.target.value}`
          );
        }
      });
    });
  }
});
