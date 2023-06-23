const calculate = document.getElementById("calculate");

calculate.addEventListener("click", (e) => {
  let height = document.getElementById("height").value;
  let weight = document.getElementById("weight").value;

  if (height === "" || weight === "") {
    alert("Pls give the input");
    return;
  }
  let heightInMeter = height / 100;

  let bmi = weight / (heightInMeter * heightInMeter);
  bmi = bmi.toFixed(2);

  document.querySelector(".ans").innerHTML = bmi;

  let status = "";

  if (bmi < 18.5) {
    status = "Under-weight";
  }
  if (bmi >= 18.5 && bmi < 25) {
    status = "Healthy";
  }
  if (bmi >= 25 && bmi < 30) {
    status = "Over-weight";
  }
  if (bmi >= 30) {
    status = "Obese";
  }
  document.querySelector("#commentmsg").innerHTML = status;

  document.getElementById("height").value = "";
  document.getElementById("weight").value = "";
});
