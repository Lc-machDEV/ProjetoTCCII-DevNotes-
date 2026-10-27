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
const saveTodo = (titulo, concluida = 0, salvarLocalmente = 1) => {
    const d = document.createElement("div");
    d.classList.add("todo");
    const e = document.createElement("h3");
    (e.innerText = titulo), d.appendChild(e);
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
    concluida && d.classList.add("concluida");
    salvarLocalmente && saveTodoLocalStorage({ titulo: titulo, concluida: concluida });
    todoList.appendChild(d), (todoInput.value = ""), todoInput.focus();
},
toggleForms = () => {
    editForm.classList.toggle("hide"),
    todoForm.classList.toggle("hide"),
    todoList.classList.toggle("hide");
},
updateTodo = (titulo) => {
    const concluida = document.querySelectorAll(".todo");
    concluida.forEach((concluida) => {
    let salvarLocalmente = concluida.querySelector("h3");
    salvarLocalmente.innerText === oldInputValue &&
        ((salvarLocalmente.innerText = titulo), updateTodoLocalStorage(oldInputValue, titulo));
    });
},
getSearchTodos = (titulo) => {
    const concluida = document.querySelectorAll(".todo");
    concluida.forEach((concluida) => {
    let salvarLocalmente = concluida.querySelector("h3").innerText.toLocaleLowerCase();
    const d = titulo.toLocaleLowerCase();
    (concluida.style.display = "flex"), salvarLocalmente.includes(d) || (concluida.style.display = "none");
    });
},
filterTodos = (titulo) => {
    const concluida = document.querySelectorAll(".todo");
    switch (titulo) {
    case "all":
        concluida.forEach((titulo) => (titulo.style.display = "flex"));
        break;
    case "concluida":
        concluida.forEach((titulo) =>
        titulo.classList.contains("concluida")
            ? (titulo.style.display = "flex")
            : (titulo.style.display = "none")
        );
        break;
    case "todo":
        concluida.forEach((titulo) =>
    titulo.classList.contains("concluida")
            ? (titulo.style.display = "none")
            : (titulo.style.display = "flex")
        );
        break;
    default:
    }
};
todoForm.addEventListener("submit", (titulo) => {
titulo.preventDefault();
// const concluida = todoInput.value;
// concluida && saveTodo(concluida);
//const form = document.getElementById(todoForm);

const dados_titulo = new FormData(todoForm);
fetch('./api/criar_tarefa.php', {
    method: 'POST',
    body: dados_titulo 
    })
    .then(response => {
        return response.json().then(data => {
            return {
                response: response,
                data: data
            };
        });
    })
    .then(resultado => {
        console.log('Status da resposta:', resultado.response.status);
        console.log('Dados recebidos:', resultado.data);
        if (!resultado.response.ok) {
            throw new Error(`Erro HTTP: ${resultado.response.status}. ${resultado.data.mensagem}`);
        }
        saveTodo(resultado.data.titulo, 0, 1);
    })
    .catch(error => {
        console.error('Erro ao enviar os dados.', error.message);
    })
}),
document.addEventListener("click", (titulo) => {
const concluida = titulo.target,
salvarLocalmente = concluida.closest("div");
let d;
    salvarLocalmente && salvarLocalmente.querySelector("h3") && (d = salvarLocalmente.querySelector("h3").innerText),
    concluida.classList.contains("finish-todo") &&
        (salvarLocalmente.classList.toggle("concluida"), updateTodoStatusLocalStorage(d)),
    concluida.classList.contains("remove-todo") &&
        (salvarLocalmente.remove(), removeTodoLocalStorage(d)),
    concluida.classList.contains("edit-todo") &&
        (toggleForms(), (editInput.value = d), (oldInputValue = d));
}),
cancelEditBtn.addEventListener("click", (titulo) => {
    titulo.preventDefault(), toggleForms();
}),
editForm.addEventListener("submit", (titulo) => {
    titulo.preventDefault();
    const concluida = editInput.value;
    concluida && updateTodo(concluida), toggleForms();
}),
searchInput.addEventListener("keyup", (titulo) => {
    const concluida = titulo.target.value;
    getSearchTodos(concluida);
}),
eraseBtn.addEventListener("click", (titulo) => {
    titulo.preventDefault(),
(searchInput.value = ""),
searchInput.dispatchEvent(new Event("keyup"));
}),
filterBtn.addEventListener("change", (titulo) => {
    const concluida = titulo.target.value;
    filterTodos(concluida);
});
const getTodosLocalStorage = () => {
    const titulo = JSON.parse(localStorage.getItem("todos")) || [];
    return titulo;
},
loadTodos = () => {
    fetch('./api/listar_tarefas.php') 
    .then(response => {
        return response.json().then(data => {
            return {
                response: response,
                data: data
            };
        });
    })
    .then(tarefas => {
        if (!tarefas.response.ok) {
            throw new Error(`Erro HTTP: ${tarefas.response.status}. ${tarefas.data.mensagem}`);
        }
        if (!Array.isArray(tarefas.data)) {
            throw new Error('Os dados recebidos da API não são um array válido.');
        }
        tarefas.data.forEach((tarefa) => {
            saveTodo(tarefa.titulo, tarefa.concluida, 0);
        });
        console.log('Status da resposta:', tarefas.response.status);
        console.log('Dados recebidos:', tarefas.data);
    })
    .catch(error => {
        console.error('Erro ao enviar os dados.', error.message);
    })
},
saveTodoLocalStorage = (titulo) => {
    const concluida = getTodosLocalStorage();
    concluida.push(titulo), localStorage.setItem("todos", JSON.stringify(concluida));
},
removeTodoLocalStorage = (titulo) => {
    const concluida = getTodosLocalStorage(),
salvarLocalmente = concluida.filter((concluida) => concluida.titulo !== titulo);
    localStorage.setItem("todos", JSON.stringify(salvarLocalmente));
},
updateTodoStatusLocalStorage = (titulo) => {
    const concluida = getTodosLocalStorage();
    concluida.map((concluida) => (concluida.titulo === titulo ? (concluida.concluida = !concluida.concluida) : null)),
    localStorage.setItem("todos", JSON.stringify(concluida));
},
updateTodoLocalStorage = (titulo, concluida) => {
    const salvarLocalmente = getTodosLocalStorage();
    salvarLocalmente.map((salvarLocalmente) => (salvarLocalmente.titulo === titulo ? (salvarLocalmente.titulo = concluida) : null)),
localStorage.setItem("todos", JSON.stringify(salvarLocalmente));
};
loadTodos();
