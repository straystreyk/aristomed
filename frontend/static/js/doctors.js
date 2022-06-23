window.addEventListener("DOMContentLoaded", () => {
  const select = document.querySelector("select");
  const pags = document.querySelectorAll(".pagination_bullet");
  const instances = M.FormSelect.init(select);
  const url_params = new URLSearchParams(window.location.search);

  instances.dropdownOptions.childNodes.forEach((el, index) => {
    if (index === 0) return;
    el.addEventListener("touchend", (e) => {
      e.stopPropagation();
    });
    el.style.borderLeft = `8px solid ${window.colors[index - 1]}`;
  });

  const change_select = (e) => {
    setTimeout(() => {
      if (!window.location.href.includes("medicine_direction")) {
        window.location.href = `?medicine_direction=${e.target.value}`;
      } else {
        const number = url_params.get("medicine_direction");
        window.location.href = window.location.href.replace(
          `medicine_direction=${number}`,
          `medicine_direction=${e.target.value}`
        );
      }
    }, 150);
  };

  const pags_init = (el) => {
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
        const number = url_params.get("page");
        window.location.href = window.location.href.replace(
          `page=${number}`,
          `page=${e.target.value}`
        );
      }
    });
  };

  if (instances) {
    instances.el.addEventListener("change", change_select);
  }

  if (pags.length) {
    pags.forEach(pags_init);
  }
});
