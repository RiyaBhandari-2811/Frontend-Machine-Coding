const slider = document.querySelector("input");
const bar = document.querySelector(".progress-bar");
const thumb = document.querySelector(".thumb");
const slideIcon = document.querySelector(".slide-Icon");

slider.oninput = () => {
  let value = slider.value;
  thumb.style.left = value + "%";
  bar.style.width = value + "%";
  if (value < 20) {
    slideIcon.style.marginTop = "0px";
  }
  if (value >= 20) {
    slideIcon.style.marginTop = "-120px";
  }
  if (value >= 40) {
    slideIcon.style.marginTop = "-250px";
  }
  if (value >= 60) {
    slideIcon.style.marginTop = "-372px";
  }
  if (value >= 80) {
    slideIcon.style.marginTop = "-500px";
  }
};
