const Starts = document.querySelectorAll(".star");
const num = document.querySelector(".num");

Starts.forEach((star, i) => {
  star.onclick = function () {
    let rating = i + 1;
    Starts.forEach((s, j) => {
      if (j + 1 <= rating) {
        s.innerHTML = "&#9733;";
      } else {
        s.innerHTML = "&#9734;";
      }
    });
    num.innerHTML = rating;
  };
});
