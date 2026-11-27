let openModal = document.querySelector(".openModal");
let modal_wrapper = document.querySelector(".modal_wrapper");
let modal_container = document.querySelector(".modal_container");
let closeModal = document.querySelector(".closeModal");

openModal.addEventListener("click", () => {
  modal_wrapper.classList.add("active");
});

closeModal.addEventListener("click", () => {
  modal_wrapper.classList.remove("active");
});

modal_wrapper.addEventListener("click", function (e) {
  if (e.target !== this) return;
  modal_wrapper.classList.remove("active");
});

// If user click on escape key our modal will get close

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    modal_wrapper.classList.remove("active");
  } else {
    return;
  }
});
