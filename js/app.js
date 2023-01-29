window.addEventListener('load', e => {
    // Get todos from local storage using localStorage.getItem('todos')
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInp = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');
    const error = document.querySelector('#error');

    // Get username save in local storage
    const username = localStorage.getItem('username') || '';

    // Assign username gotten from localStorage to name input value
    nameInp.value = username;

    // Listen to a change event on the name input field
    nameInp.addEventListener('change', e => {
        // Store username into localStorage using localStorage.setItem();
        localStorage.setItem('username', e.target.value);
    });

    newTodoForm.addEventListener('submit', e => {
        e.preventDefault(); // Stop the browser from refreshing on submit
        if(
            e.target.elements.content.value === '' ||
            e.target.elements.category.value === ''
        ) {
            e.target.elements.content.focus();
            error.innerHTML = "Kindly enter a todo and choose a category";
            return;
        };

        const todo = {
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            isDone: false,
            createAt: new Date().getTime()
        }

        todos.push(todo);

        localStorage.setItem('todos', JSON.stringify(todos));

        e.target.reset();

        displayTodos();
    });

    displayTodos();
});

function displayTodos() {
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = "";

    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const content = document.createElement('div');
        const action = document.createElement('div');
        const editBtn = document.createElement('button');
        const delBtn = document.createElement('button');

        input.type = "checkbox";
        input.checked = todo.isDone;
        span.classList.add('bubble');

        switch(todo.category) {
            case 'personal':
                span.classList.add('personal');
                break;
            case 'business':
                span.classList.add('business');
                break;
            default:
                return;
        }

        content.classList.add('todo-content');
        action.classList.add('actions');
        delBtn.classList.add('delete');
        editBtn.classList.add('edit');

        content.innerHTML = `<input type="text" value="${todo.content}" readonly />`;
        editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
        delBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

        label.appendChild(input);
        label.appendChild(span);
        action.appendChild(editBtn);
        action.appendChild(delBtn);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(action);

        todoList.appendChild(todoItem);

        if(todo.isDone) {
            todoItem.classList.add('done');
        }

        input.addEventListener('click', e => {
            todo.isDone = e.target.checked;
            localStorage.setItem('todos', JSON.stringify(todos));

            if(todo.isDone) {
                todoItem.classList.add('done');
            } else {
                todoItem.classList.remove('done');
            }

            displayTodos();
        });

        editBtn.addEventListener('click', e => {
            const todoInput = content.querySelector('input');
            todoInput.removeAttribute('readonly');
            todoInput.focus();
            todoInput.addEventListener('blur', e => {
                todo.content = e.target.value;
                todoInput.setAttribute('readonly', true);
                localStorage.setItem('todos', JSON.stringify(todos));
                displayTodos();
            });
        });

        delBtn.addEventListener('click', e => {
            todos = todos.filter(t => t != todo);
            localStorage.setItem('todos', JSON.stringify(todos));
            displayTodos();
        });
    })
}