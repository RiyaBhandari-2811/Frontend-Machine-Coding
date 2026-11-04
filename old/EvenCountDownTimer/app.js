const countDownDate = new Date("June 30 , 2023 00:00:00").getTime();
const interval = setInterval(function () {
  var currentDate = new Date().getTime();
  var distance = countDownDate - currentDate;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.querySelector(".day").innerHTML = days;
  document.querySelector(".hour").innerHTML = hours;
  document.querySelector(".min").innerHTML = minutes;
  document.querySelector(".sec").innerHTML = seconds;

  if(distance < 0){
    clearInterval(interval);
    document.querySelector(".day").innerHTML = "00";
  document.querySelector(".hour").innerHTML = "00";
  document.querySelector(".min").innerHTML = "00";
  document.querySelector(".sec").innerHTML = "00";
  }

}, 1000);
