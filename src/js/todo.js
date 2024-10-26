import "../css/todo.css"
import { checkTokenValidity, getUserDataByToken, login, updateToken } from "./api/auth";
import { getUserTodos } from "./api/todos";
import { displayUser } from "./common";
console.log(checkTokenValidity);

document.addEventListener("DOMContentLoaded", async () => {

    initApp()
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = document.getElementById("username-input").value;
        const password = document.getElementById("password-input").value;
        const tokens = await login(username, password);

        if (tokens) {
            const accessToken = tokens.accessToken;
            const refreshToken = tokens.refreshToken;
            const userData = await getUserDataByToken(accessToken);
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            showTodoSection();
            await displayUser(accessToken);
            await displayUserTodos(userData.id)
        }

    })

})


async function initApp() {
    const token = localStorage.getItem("token");

    const loginButton = document.querySelectorAll("#loginButton")
    const userData = await getUserDataByToken(token)


    if (token !== "null" &&
        token !== false &&
        token !== null &&
        await checkTokenValidity(token)
    ) {
        showTodoSection()
        displayUserTodos(userData.id)


    } else if (token === "null" || token == "") {
        showGuestSection()
        loginButton.forEach(el => {
            el.style.display = "flex"
        })
    } else {
        const newToken = await updateToken()
        localStorage.setItem("token", newToken)
        initApp()
    }
}

async function displayUserTodos(userId) {

    const todoList = await getUserTodos(userId)

    const todos = todoList.todos
    const todoContainer = document.querySelector(".todo__list")
    if (!todoList) { return null }

    if (todos.length === 0) {

    }
    todos.forEach(element => {
        const li = document.createElement("li");
        li.classList.add("todo__item");
        li.innerHTML = `${element.todo}<button class="delete-button">Удалить</button>`
        todoContainer.appendChild(li)
    });
}


function showGuestSection() {
    const guestSection = document.querySelector(".guest-user");
    const todoSection = document.querySelector(".main__todo-list");
    guestSection.style.display = "flex";
    todoSection.style.display = "none";
}

function showTodoSection() {
    const guestSection = document.querySelector(".guest-user");
    const todoSection = document.querySelector(".main__todo-list");
    guestSection.style.display = "none";
    todoSection.style.display = "block";
}
