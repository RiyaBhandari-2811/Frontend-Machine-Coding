const DaysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let day = document.querySelector(".day ");
let date = document.querySelector(".date ");

const today = new Date();

day.textContent = DaysOfWeek[today.getDay()];
date.textContent = today.toLocaleString();

