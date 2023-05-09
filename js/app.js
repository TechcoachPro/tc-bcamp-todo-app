window.addEventListener("load", async (e) => {
  // Get todos from local storage using localStorage.getItem('todos')
  // todos => is a global variable
  apiUrl = `http://localhost:4000`;
  todos = (await getTodos()) || [];
  const nameInp = document.querySelector("#name");
  const newTodoForm = document.querySelector("#new-todo-form");
  const error = document.querySelector("#error");

  // Get username save in local storage
  const username = localStorage.getItem("username") || "";

  // Assign username gotten from localStorage to name input value
  nameInp.value = username;

  // Listen to a change event on the name input field
  nameInp.addEventListener("change", (e) => {
    // Store username into localStorage using localStorage.setItem();
    localStorage.setItem("username", e.target.value);
  });

  // Add a new todo to the list on submit
  newTodoForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop the browser from refreshing on submit

    // Simple validation to check if content is emptly likewise category.
    if (
      e.target.elements.content.value === "" ||
      e.target.elements.category.value === ""
    ) {
      e.target.elements.content.focus();
      error.innerHTML = "Kindly enter a todo and choose a category";
      return;
    }

    const todo = {
      content: e.target.elements.content.value,
      category: e.target.elements.category.value,
      isDone: false,
      createAt: new Date(),
    }; // A new todo object instance

    const response = await fetch(`${apiUrl}/`, {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    todos.push(data.todo); // Adding the new todo object to the global todos Array

    // Reset the todo inputs
    e.target.reset();

    // Display the todo again with the new array.
    displayTodos();
  });

  // Display todos
  displayTodos();
});

async function getTodos() {
  try {
    const response = await fetch(`${apiUrl}/`);
    const data = await response.json();
    return data.todo;
  } catch (error) {
    console.log(error);
  }
}

// This function will display all todos
function displayTodos() {
  const todoList = document.querySelector("#todo-list");
  todoList.innerHTML = ""; // This will reset the innerHTML of the todo-list element.

  // Loop through the global variable todos to get all todos
  todos.forEach((todo) => {
    // Create all html element dynamically using createElement
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item"); // Add todo-item class

    const label = document.createElement("label"); // Create label element
    const input = document.createElement("input"); // Create input element
    const span = document.createElement("span"); // Create span element
    const content = document.createElement("div"); // Create content div element
    const action = document.createElement("div"); // Create action div element
    const editBtn = document.createElement("button"); // Create edit button
    const delBtn = document.createElement("button"); // Create delete button

    input.type = "checkbox"; // Assign checkbox type to input element
    input.checked = todo.isDone; // Assign checked to true or false base on todo
    span.classList.add("bubble"); // Assign bubble class to span element

    /* A switch case to check if todo category is personal or
     * business and assign the respective class
     */
    switch (todo.category) {
      case "personal":
        span.classList.add("personal");
        break;
      case "business":
        span.classList.add("business");
        break;
      default:
        return;
    }

    // Adding respective classes to elements
    content.classList.add("todo-content");
    action.classList.add("actions");
    delBtn.classList.add("delete");
    editBtn.classList.add("edit");

    // Assign todo.content as value for content input
    content.innerHTML = `<input type="text" value="${todo.content}" readonly />`;

    // Adding delete and edit icon as innerHTML to editBtn and delBtn
    editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    delBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

    /* Dynamically appending the respective child of each parent element,
     * base on the our html structure.
     */
    label.appendChild(input);
    label.appendChild(span);
    action.appendChild(editBtn);
    action.appendChild(delBtn);
    todoItem.appendChild(label);
    todoItem.appendChild(content);
    todoItem.appendChild(action);

    // Appending the each todo item to the todo list.
    todoList.appendChild(todoItem);

    if (todo.isDone) {
      // is todo is completed, add a class done to todo item
      todoItem.classList.add("done");
    }

    // check if I marked a todo as done or not
    input.addEventListener("click", (e) => {
      todo.isDone = e.target.checked;
      localStorage.setItem("todos", JSON.stringify(todos));

      if (todo.isDone) {
        todoItem.classList.add("done");
      } else {
        todoItem.classList.remove("done");
      }

      displayTodos();
    });

    // Onclick will enable me to edit each todo item
    editBtn.addEventListener("click", (e) => {
      const todoInput = content.querySelector("input");
      todoInput.removeAttribute("readonly");
      todoInput.focus();
      todoInput.addEventListener("blur", (e) => {
        todo.content = e.target.value;
        todoInput.setAttribute("readonly", true);
        localStorage.setItem("todos", JSON.stringify(todos));
        displayTodos();
      });
    });

    // Dynamically remove a todo from localStorage
    delBtn.addEventListener("click", (e) => {
      todos = todos.filter((t) => t != todo);
      localStorage.setItem("todos", JSON.stringify(todos));
      displayTodos();
    });
  });
}
