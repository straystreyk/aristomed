window.addEventListener("DOMContentLoaded", () => {
  const select = document.querySelectorAll("select");
  const form_create = document.querySelector(".form_create");
  const all_inputs = document.querySelectorAll(".form_input");
  const image_url_input = document.querySelector(".image_url_input");
  const file_input = document.querySelector(".file_input");
  const add_more = document.querySelector(".add_more");
  const modalMUI = document.querySelector(".modal");
  const modal = M.Modal.init(modalMUI);
  const instances = M.FormSelect.init(select);

  let values = {};

  if (add_more) {
    add_more.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(
        `[data-more-target=${add_more.dataset.more}]`
      );
      let inputs = target.querySelectorAll(".input");
      if (inputs.length) {
        inputs.forEach((el) => {
          values[el.id] = el.value;
        });
      }

      target.innerHTML += `
        <div>
            <div class="input-field col s12">
                <input required name="title" id="title${target.children.length}" type="text" class="validate input"/>
                <label for="title${target.children.length}">Заголовок</label>
            </div>
            <div class="input-field col s12">
                <textarea required name="description" id="description${target.children.length}" type="text" class="validate materialize-textarea input"></textarea>
                <label for="description${target.children.length}">Описание</label>
                <span class="helper-text">Обязательно в конце ставить ; после каждого образовательного заведения. Пример: Основное: Санкт-Петербургский государственный медицинский университет им. акад. И.П. Павлова, Лечебное дело, 2005; Ординатура: Санкт-Петербургский государственный медицинский университет им. акад. И.П. Павлова, Хирургия, 2008;</span>
            </div>
        </div>`;

      inputs = target.querySelectorAll(".input");
      if (inputs.length && Object.keys(values).length) {
        inputs.forEach((el) => {
          if (el.id in values) {
            el.value = values[el.id];
          }
        });
      }
    });
  }

  if (file_input) {
    file_input.addEventListener("change", async () => {
      const formData = new FormData();
      formData.append("file", file_input.files[0]);
      try {
        const res = await fetch("/image_uploader", {
          method: "POST",
          body: formData,
        });
        const { url } = await res.json();
        if (image_url_input) {
          image_url_input.value = url;
        }
      } catch (e) {
        console.log(e.message);
      }
    });
  }
  if (form_create) {
    form_create.addEventListener("submit", async (e) => {
      e.preventDefault();
      let data = {};
      values = {}; //for input with array
      all_inputs.forEach((el) => {
        if (el.dataset.moreTarget) {
          const children = el.querySelectorAll(".input");
          values[el.dataset.moreTarget] = [];
          children.forEach((child) => {
            if (child.value) {
              const index = child.id.replace(/[^\d+]/g, "");
              if (!values[el.dataset.moreTarget][index]) {
                values[el.dataset.moreTarget][index] = {};
              }
              if (child.name === "description") {
                values[el.dataset.moreTarget][index][child.name] = child.value
                  .replace("\n", "")
                  .split(";")
                  .filter(Boolean);
                return;
              }
              values[el.dataset.moreTarget][index][child.name] = child.value;
            }
          });
        }
        if (el.getAttributeNames().includes("multiple")) {
          instances.forEach((select) => {
            if (select.$el[0] === el && select.getSelectedValues().length) {
              data[el.name] = select.getSelectedValues();
            }
          });
          return;
        }
        if (!!el.value || el.name === "image") {
          data[el.name] = el.value;
        }
      });

      if (!data.image && data.sex) {
        if (data.sex === "female") {
          data.image = "/images/doctors/woman_empty.svg";
        } else {
          data.image = "/images/doctors/man_empty.svg";
        }
      }

      if (Object.keys(values).length) {
        data = { ...data, ...values };
      }

      try {
        const res = await fetch(window.url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const { message, redirect } = await res.json();
        if (modal) {
          modal.el.firstElementChild.innerHTML = `
          <div>
              ${message}
          </div>
          <div>
              <a class="waves-effect btn-small" href="${redirect}">Вернуться к списку</a>
          </div>
        `;
          modal.open();
        }
      } catch (e) {
        console.log(e.message);
      }
    });
  }
});
