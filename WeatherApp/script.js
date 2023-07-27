const inputBox = document.querySelector(".input-box");
const searchBtn = document.getElementById("searchBtn");
const weatherImg = document.querySelector(".weather-img");
const temperature = document.querySelector(".temperature");
const description = document.querySelector(".description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");

function changeImg(imgType) {
  if (imgType == "Rain" || imgType == "Storm") {
    weatherImg.src = "./assets/storm.png";
  } else if (imgType == "Clouds") {
    weatherImg.src = "./assets/clouds.png";
  } else if (imgType == "Sun" || imgType == "Clear") {
    weatherImg.src = "./assets/sun.png";
  } else if (imgType == "Snow") {
    weatherImg.src = "./assets/snow.png";
  } else if (imgType == "Mist") {
    weatherImg.src = "./assets/mist.png";
  } else {
    weatherImg.src = "./assets/error-404.png";
  }
}

searchBtn.onclick = async () => {
  let cityName = inputBox.value;
//   inputBox.value = "";

  const weather = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=API`
  ).then((res) => res.json());

  console.log(weather);

  temperature.innerHTML = `${Math.round(
    weather.main.temp - 273.15
  )} <sup>°C</sup> `;

  description.innerHTML = `${weather.weather[0].main}`;
  changeImg(`${weather.weather[0].main}`);

  humidity.innerHTML = `${weather.main.humidity} %`;

  windSpeed.innerHTML = `${weather.wind.speed} Km/H`;
};
