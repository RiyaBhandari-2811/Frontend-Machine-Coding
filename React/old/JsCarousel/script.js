const carousel = document.querySelector(".carousel");
const items = carousel.querySelectorAll(".item");
const btns = carousel.querySelectorAll(".btn");

btns.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    items.forEach((item) => item.classList.remove("selected_item"));
    btns.forEach((btn) => btn.classList.remove("selected"));

    items[i].classList.add("selected_item");
    btn.classList.add("selected");
  });
});
