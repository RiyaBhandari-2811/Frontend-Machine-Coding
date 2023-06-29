let submit = document.querySelector("#submit");

submit.addEventListener("click", () => {
  let feet = parseInt(document.getElementById("feet").value);
  let inches = parseInt(document.getElementById("inches").value);

  let feetToInch = feet * 12;
  let totalInch = feetToInch + inches;
  let inchToCM = totalInch * 2.54;

  document.querySelector(".ans").textContent = `${inchToCM.toFixed(2)} cm`;
});
