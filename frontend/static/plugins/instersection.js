const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5,
};

export const observer = new IntersectionObserver((entries, observer) => {
  // для каждой записи-целевого элемента
  entries.forEach((entry) => {
    // если элемент является наблюдаемым
    if (entry.isIntersecting) {
      const lazyImg = entry.target;
      lazyImg.classList.add("active");
      lazyImg.src = lazyImg.dataset.src;
      //прекращаем наблюдение
      observer.unobserve(lazyImg);
    }
  });
}, options);
