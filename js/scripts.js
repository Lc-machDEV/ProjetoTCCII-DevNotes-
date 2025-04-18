const todoForm = document.querySelector("#todo-form"),
todoInput = document.querySelector("#todo-input"),
todoList = document.querySelector("#todo-list"),
editForm = document.querySelector("#edit-form"),
editInput = document.querySelector("#edit-input"),
cancelEditBtn = document.querySelector("#cancel-edit-btn"),
searchInput = document.querySelector("#search-input"),
eraseBtn = document.querySelector("#erase-button"),
filterBtn = document.querySelector("#filter-select");
let oldInputValue;
const saveTodo = (a, b = 0, c = 1) => {
    const d = document.createElement("div");
    d.classList.add("todo");
    const e = document.createElement("h3");
    (e.innerText = a), d.appendChild(e);
    const f = document.createElement("button");
    f.classList.add("finish-todo"),
    (f.innerHTML = '<i class="fa-solid fa-check"></i>'),
    d.appendChild(f);
    const g = document.createElement("button");
    g.classList.add("edit-todo"),
    (g.innerHTML = '<i class="fa-solid fa-pen"></i>'),
    d.appendChild(g);
    const h = document.createElement("button");
    h.classList.add("remove-todo"),
    (h.innerHTML = '<i class="fa-solid fa-xmark"></i>'),
    d.appendChild(h),
    b && d.classList.add("done");
    c && saveTodoLocalStorage({ text: a, done: b });
    todoList.appendChild(d), (todoInput.value = ""), todoInput.focus();
},
toggleForms = () => {
    editForm.classList.toggle("hide"),
    todoForm.classList.toggle("hide"),
    todoList.classList.toggle("hide");
},
updateTodo = (a) => {
    const b = document.querySelectorAll(".todo");
    b.forEach((b) => {
    let c = b.querySelector("h3");
    c.innerText === oldInputValue &&
        ((c.innerText = a), updateTodoLocalStorage(oldInputValue, a));
    });
},
getSearchTodos = (a) => {
    const b = document.querySelectorAll(".todo");
    b.forEach((b) => {
    let c = b.querySelector("h3").innerText.toLocaleLowerCase();
    const d = a.toLocaleLowerCase();
    (b.style.display = "flex"), c.includes(d) || (b.style.display = "none");
    });
},
filterTodos = (a) => {
    const b = document.querySelectorAll(".todo");
    switch (a) {
    case "all":
        b.forEach((a) => (a.style.display = "flex"));
        break;
    case "done":
        b.forEach((a) =>
        a.classList.contains("done")
            ? (a.style.display = "flex")
            : (a.style.display = "none")
        );
        break;
    case "todo":
        b.forEach((a) =>
    a.classList.contains("done")
            ? (a.style.display = "none")
            : (a.style.display = "flex")
        );
        break;
    default:
    }
};
todoForm.addEventListener("submit", (a) => {
a.preventDefault();
const b = todoInput.value;
b && saveTodo(b);
}),
document.addEventListener("click", (a) => {
const b = a.target,
c = b.closest("div");
let d;
    c && c.querySelector("h3") && (d = c.querySelector("h3").innerText),
    b.classList.contains("finish-todo") &&
        (c.classList.toggle("done"), updateTodoStatusLocalStorage(d)),
    b.classList.contains("remove-todo") &&
        (c.remove(), removeTodoLocalStorage(d)),
    b.classList.contains("edit-todo") &&
        (toggleForms(), (editInput.value = d), (oldInputValue = d));
}),
cancelEditBtn.addEventListener("click", (a) => {
    a.preventDefault(), toggleForms();
}),
editForm.addEventListener("submit", (a) => {
    a.preventDefault();
    const b = editInput.value;
    b && updateTodo(b), toggleForms();
}),
searchInput.addEventListener("keyup", (a) => {
    const b = a.target.value;
    getSearchTodos(b);
}),
eraseBtn.addEventListener("click", (a) => {
    a.preventDefault(),
(searchInput.value = ""),
searchInput.dispatchEvent(new Event("keyup"));
}),
filterBtn.addEventListener("change", (a) => {
    const b = a.target.value;
    filterTodos(b);
});
const getTodosLocalStorage = () => {
    const a = JSON.parse(localStorage.getItem("todos")) || [];
    return a;
},
loadTodos = () => {
    const a = getTodosLocalStorage();
    a.forEach((a) => {
saveTodo(a.text, a.done, 0);
    });
},
saveTodoLocalStorage = (a) => {
    const b = getTodosLocalStorage();
    b.push(a), localStorage.setItem("todos", JSON.stringify(b));
},
removeTodoLocalStorage = (a) => {
    const b = getTodosLocalStorage(),
c = b.filter((b) => b.text !== a);
    localStorage.setItem("todos", JSON.stringify(c));
},
updateTodoStatusLocalStorage = (a) => {
    const b = getTodosLocalStorage();
    b.map((b) => (b.text === a ? (b.done = !b.done) : null)),
    localStorage.setItem("todos", JSON.stringify(b));
},
updateTodoLocalStorage = (a, b) => {
    const c = getTodosLocalStorage();
    c.map((c) => (c.text === a ? (c.text = b) : null)),
localStorage.setItem("todos", JSON.stringify(c));
};
loadTodos();
