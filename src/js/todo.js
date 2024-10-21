import "../css/todo.css"
import { checkTokenValidity, getUserDataByToken, updateToken } from "./api/auth";
import { getUserTodos } from "./api/todos";

document.addEventListener("DOMContentLoaded", async () => {

    await initApp()

})


async function initApp() {
    try {
        const token = localStorage.getItem("token")
        if (token && token !== "null" && token !== false && checkTokenValidity(token)) {
            toggleTodoDisplay("open");
            const userData = await getUserDataByToken(token);
            const userTodos = await getUserTodos(userData.id)
            displayUserTodos(userTodos);


        } else {
            await updateToken();
            const newToken = await localStorage("token");
            if (newToken) {
                await initApp()
            } else {
                throw new Error('Network response was not ok');
            }
        }

    } catch (error) {
        console.log("Попробуйте авторизоваться снова. Неизвестная ошибка", error);

    }


}

function toggleTodoDisplay(action) {
    const guestSection = document.querySelector(".guest-user");
    const todoSection = document.querySelector(".main__todo-list");
    switch (action) {
        case "open":
            guestSection.style.display = "none";
            todoSection.style.display = "block";
            break;
        case "close":
            guestSection.style.display = "flex";
            todoSection.style.display = "none";
            break;
    };

};

async function displayUserTodos(todoObj) {
    const todoList = document.querySelector(".todo__list")
    const todos = todoObj.todos

    if (todos.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.innerText = "Нет задач";
        todoList.appendChild(emptyMessage);
        return;
    }
    todos.forEach(element => {
        const li = document.createElement("li");
        li.classList.add("todo__item");
        li.innerHTML = `${element.todo}<button class="delete-button">Удалить</button>`
        todoList.appendChild(li)

    });
}
