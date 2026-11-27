function AddItem(e) {
  let value = document.getElementById("Item").value;
  document.getElementById("Item").value = "";
  let itemLi = document.createElement("li");
  itemLi.textContent = value;

  let checkI = document.createElement("i");
  checkI.classList.add("fa-solid", "fa-check");
  checkI.addEventListener("click", checkItem);
  itemLi.appendChild(checkI);

  let deleteI = document.createElement("i");
  deleteI.classList.add("fa-solid", "fa-trash");
  itemLi.appendChild(deleteI);
  deleteI.addEventListener("click", deleteItem);

  document.querySelector("ul").appendChild(itemLi);
  saveData();
}

function checkItem(e) {
  //   console.log(e.target.tagName);
  if (e.target.tagName === "I" && e.target.classList.contains("fa-check")) {
    e.target.parentElement.classList.toggle("check");
  }
  saveData();
}

function deleteItem(e) {
  //   console.log(e.target);
  //   console.log(e.target.parentElement);
  if (e.target.tagName === "I" && e.target.classList.contains("fa-trash")) {
    e.target.parentElement.remove();
  }
  saveData();
}

function saveData() {
  console.log("data set");
  localStorage.setItem("data", document.querySelector("ul").innerHTML);
}

// (function displayData() {
//   document.querySelector("ul").innerHTML = localStorage.getItem("data");
// })();

function displayData() {
  document.querySelector("ul").innerHTML = localStorage.getItem("data");
}

displayData();
