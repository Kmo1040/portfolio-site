const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");

let todo = JSON.parse(localStorage.getItem("todo-list"));
if (!todo) {
  todo = [];
}

function CreateToDoItems() {
  if (todoValue.value === "") {
    todoAlert.innerText = "Please enter your to do text!";
    todoValue.focus();
  } else {
    let IsPresent = false;
    todo.forEach((element) => {
      if (element.item == todoValue.value) {
        IsPresent = true;
      }
    });

    if (IsPresent) {
      setAlertMessage("This item already present in the list!");
      return;
    }

    let li = document.createElement("li");
    const todoItems = `
        <div class="todo-item">
            <img class="checkbox todo-controls" src="/P-ToDoList/images/square.png" onclick="ToggleComplete(this)" />
            <div class="todo-text">${todoValue.value}</div>
            <div>
                <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/P-ToDoList/images/pencil-simple.png" />
                <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/P-ToDoList/images/trash.png" />
            </div>
        </div>
    `;
    li.innerHTML = todoItems;
    listItems.appendChild(li);

    if (!todo) {
      todo = [];
    }
    let itemList = { item: todoValue.value, status: false };
    todo.push(itemList);
    setLocalStorage();
  }
  todoValue.value = "";
  setAlertMessage("To Do Item Created Successfully!");
}

function ReadToDoItems() {
  todo.forEach((element) => {
    let li = document.createElement("li");

    const checkboxIcon = element.status ? "check-square.png" : "square.png";
    const textDecoration = element.status ? "line-through" : "";

    const todoItems = `
        <div class="todo-item">
            <img class="checkbox todo-controls" src="/P-ToDoList/images/square.png" onclick="ToggleComplete(this)" />
            <div class="todo-text">${element.item}</div>
            <div>
                <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/P-ToDoList/images/pencil-simple.png" />
                <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/P-ToDoList/images/trash.png" />
            </div>
        </div>
    `;

    li.innerHTML = todoItems;
    listItems.appendChild(li);
  });
}
ReadToDoItems();

function UpdateToDoItems(e) {
  if (
    e.parentElement.parentElement.querySelector("div").style.textDecoration ===
    ""
  ) {
    todoValue.value =
      e.parentElement.parentElement.querySelector("div").innerText;
    updateText = e.parentElement.parentElement.querySelector("div");
    addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
    addUpdate.setAttribute("src", "/P-ToDoList/images/check-fat.png");
    todoValue.focus();
  }
}

function UpdateOnSelectionItems() {
  let IsPresent = false;
  todo.forEach((element) => {
    if (element.item == todoValue.value) {
      IsPresent = true;
    }
  });

  if (IsPresent) {
    setAlertMessage("This item already present in the list!");
    return;
  }

  todo.forEach((element) => {
    if (element.item == updateText.innerText.trim()) {
      element.item = todoValue.value;
    }
  });
  setLocalStorage();

  updateText.innerText = todoValue.value;
  addUpdate.setAttribute("onclick", "CreateToDoItems()");
  addUpdate.setAttribute("src", "/P-ToDoList/images/plus-circle.png");
  todoValue.value = "";
  setAlertMessage("To Do Item Updated Successfully!");
}

function DeleteToDoItems(e) {
  const li = e.closest("li"); // safer selection
  let deleteValue = li.querySelector(".todo-text").innerText;

  if (confirm(`Are you sure? Do you want to delete: ${deleteValue}?`)) {
    li.classList.add("deleted-item");
    todoValue.focus();

    todo = todo.filter((element) => element.item !== deleteValue.trim());

    setTimeout(() => {
      li.remove();
    }, 1000);

    setLocalStorage();
  }
}

function CompletedToDoItems(e) {
  const todoDiv = e.parentElement.querySelector("div");
  const itemText = todoDiv.innerText.trim();
  const checkIcon = todoDiv.querySelector("img.check");
  const editIcon = e.parentElement.querySelector("img.edit");

  if (todoDiv.style.textDecoration === "") {
    // Mark as completed
    todoDiv.style.textDecoration = "line-through";
    checkIcon.style.display = "inline";
    if (editIcon) editIcon.style.display = "none";

    // Update status
    todo.forEach((element) => {
      if (element.item === itemText) element.status = true;
    });

    setAlertMessage("To Do Item Completed Successfully!");

  } else {
    // Undo completion
    todoDiv.style.textDecoration = "";
    checkIcon.style.display = "none";
    if (editIcon) editIcon.style.display = "inline";

    // Update status
    todo.forEach((element) => {
      if (element.item === itemText) element.status = false;
    });

    setAlertMessage("Undo complete – item restored!");
  }

  setLocalStorage();
}

function setLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todo));
}

function setAlertMessage(message) {
  todoAlert.removeAttribute("class");
  todoAlert.innerText = message;
  setTimeout(() => {
    todoAlert.classList.add("toggleMe");
  }, 1000);
}

function ToggleComplete(e) {
  const todoDiv = e.parentElement.querySelector(".todo-text");
  const itemText = todoDiv.innerText.trim();

  if (e.src.includes("/P-ToDoList/images/square.png")) {
    // Mark as completed
    e.src = "/P-ToDoList/images/check-square.png";
    todoDiv.style.textDecoration = "line-through";

    // Hide edit icon
    const editIcon = e.parentElement.querySelector("img.edit");
    if (editIcon) editIcon.style.display = "none";

    // Update status
    todo.forEach((element) => {
      if (element.item === itemText) element.status = true;
    });

    setAlertMessage("Task marked as completed!");

  } else {
    // Undo completed
    e.src = "/P-ToDoList/images/square.png";
    todoDiv.style.textDecoration = "";

    // Show edit icon
    const editIcon = e.parentElement.querySelector("img.edit");
    if (editIcon) editIcon.style.display = "inline";

    // Update status
    todo.forEach((element) => {
      if (element.item === itemText) element.status = false;
    });

    setAlertMessage("Task marked as active!");
  }

  setLocalStorage();
}