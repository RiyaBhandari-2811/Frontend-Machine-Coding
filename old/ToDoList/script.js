function addTodo() {
  const userTodoValue = document.getElementById("toDoInput").value;
  document.getElementById("toDoInput").value = "";

  // Every time user makes a new todo we'll create the div and add the user todo
  createTodo(userTodoValue);
}

function createTodo(value) {
  const todos = document.createElement("div");
  todos.classList.add("todos");

  // user todo value
  const todo = document.createElement("div");
  todo.id = "todo";
  //   todo.classList.add("todoComplete")
  todo.textContent = value;
  todos.appendChild(todo);

  // Now we've to add 3 different button
  // First Todo Finished
  let buttonfirst = document.createElement("button");
  let iTagFirst = document.createElement("i");
  iTagFirst.classList.add("fa-solid", "fa-check");
  buttonfirst.appendChild(iTagFirst);
  todos.appendChild(buttonfirst);
  buttonfirst.addEventListener("click", todoComplete);

  // Edit Todo
  let buttonsecond = document.createElement("button");
  let iTagSecond = document.createElement("i");
  iTagSecond.classList.add("fa-solid", "fa-pen-to-square");
  buttonsecond.appendChild(iTagSecond);
  todos.appendChild(buttonsecond);
  buttonsecond.addEventListener("click", editToDo);

  // Delete todo
  let buttonthird = document.createElement("button");
  let iTagThird = document.createElement("i");
  iTagThird.classList.add("fa-solid", "fa-trash");
  buttonthird.appendChild(iTagThird);
  todos.appendChild(buttonthird);
  buttonthird.addEventListener("click", deleteTodo);

  let displayTodos = document.querySelector(".displayTodos");
  displayTodos.appendChild(todos);
}

function todoComplete() {
  console.log("click 1");
  let getTodoDiv = document.getElementById("todo");
  getTodoDiv.classList.toggle("todoComplete");
}

function editToDo() {
  console.log("click 2");
  let getTodoDiv = document.getElementById("todo");
  getTodoDiv.setAttribute("contenteditable", true);
  setTimeout(() => {
    getTodoDiv.setAttribute("contenteditable", false);
  }, 5000);
}

function deleteTodo() {
  console.log("click 3");
  let removeTodo = document.querySelector(".todos");
  removeTodo.remove();
}
