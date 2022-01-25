const addTodoForm = document.getElementById("addTodoForm");
const titleInput = document.getElementById("titleInput");
const prioritySelect = document.getElementById("prioritySelect");
const submitBtn = document.getElementById("submitBtn");
const todoListOl = document.getElementById("todoListOl");

const baseURL = "http://localhost:3000";

const priorityColorClassMap = {
    "Very High": "bg-danger",
    High: "bg-warning",
    Medium: "bg-primary",
    Low: "bg-info",
    "Very Low": "bg-secondary",
};

const getTodos = async () => {
    const response = await fetch(`${baseURL}/todos`);
    const todos = await response.json();
    return todos;
};

const refreshTodos = async () => {
    const todos = await getTodos();
    displayTodos(todos);
};

const addTodo = async () => {
    const taskTitle = titleInput.value;
    const priority = prioritySelect.value;
    const body = {
        title: taskTitle,
        priority,
    };
    const response = await fetch(`${baseURL}/todos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (response.status === 201) {
        titleInput.value = "";
        prioritySelect.value = "";
        refreshTodos();
    }
};

const removeTodo = async (index) => {
    body = {
        index: index,
    };
    const response = await fetch(`${baseURL}/todos`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (response.status === 200) {
        refreshTodos();
    }
};

const updateTodo = async (index) => {
    const updateTitleInput = document.getElementById("updateTitleInput");
    const updatePrioritySelect = document.getElementById(
        "updatePrioritySelect"
    );
    const newTitle = updateTitleInput.value;
    const newPriority = updatePrioritySelect.value;
    const body = {
        index: index,
        title: newTitle,
        priority: newPriority,
    };

    const response = await fetch(`${baseURL}/todos`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (response.status === 200) {
        closeModal();
        refreshTodos();
    }
};

function closeModal() {
    const modalDiv = document.querySelector(".modal");
    modalDiv.classList.remove("show");
    setTimeout(() => modalDiv.parentElement.removeChild(modalDiv), 500);
}

const displayUpdateModal = (index, title, priority) => {
    const modalDiv = document.createElement("div");
    const options = ["Very High", "High", "Medium", "Low", "Very Low"];
    const optionItems = options.map(
        (option) =>
            `<option ${
                option === priority ? "selected" : ""
            }>${option}</option>`
    );
    modalDiv.addEventListener("click", (event) => {
        if (event.target === modalDiv) {
            closeModal();
        }
    });
    modalDiv.className = "modal fade d-block";
    modalDiv.setAttribute("aria-modal", true);
    modalDiv.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5>Update Task</h5>
                    <button class="btn-close" onclick="closeModal()"/>
                </div>
                <div class="modal-body">
                    <label class="form-label">Task Title</label>
                    <input id="updateTitleInput" class="form-control" value="${title}" required>
                    <label class="form-label mt-3">Task Priority</label>
                    <select id="updatePrioritySelect" class="form-select" value="${priority}">
                        ${optionItems.join("")}
                    </select>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal()">Close</button>
                    <button class="btn btn-primary" onclick="updateTodo(${index})">Save Changes</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalDiv);
    setTimeout(() => modalDiv.classList.add("show"), 1);
};

const displayTodos = (todos) => {
    const todoItems = todos.map(
        (todo, index) => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="ms-4 me-auto">
                    <div class="fw-bold">${todo.title}</div>
                    ${todo.dateCreated}
                </div>
                <div class="d-flex flex-column">
                    <span class="badge ${
                        priorityColorClassMap[todo.priority]
                    } rounded-pill">${todo.priority}</span>
                    <div class="d-flex flex-row">
                        <button 
                            class="btn btn-secondary btn-sm"
                            onclick="displayUpdateModal(${index},'${
            todo.title
        }', '${todo.priority}')">
                            Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="removeTodo(${index})">
                            Delete
                        </button>
                    </div>
                </div>
            </li>
        `
    );
    todoListOl.innerHTML = todoItems.join("");
};

submitBtn.addEventListener("click", (event) => {
    if (addTodoForm.checkValidity()) {
        event.preventDefault();
        addTodo();
    }
});

refreshTodos();
