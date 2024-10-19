import "../css/todo.css"
import { checkTokenValidity, getUserDataByToken } from "./api/auth";
import { getUserTodos } from "./api/todos";

document.addEventListener("DOMContentLoaded", async () => {
   
    
    // ! Попробовать единожды проверить токет и его валидацию, и только в этом случае все прогружать
    await toggleTodoDisplay()

    const userId = await getUserId()
    const userTodos = await getUserTodos(userId);

    console.log(await userId);

    console.log(await userTodos);

    displayUserTodos(await userTodos)


    


})







export async function toggleTodoDisplay() {
    const guestSection = document.querySelector(".guest-user");
    const todoSection = document.querySelector(".main__todo-list");
    const token = localStorage.getItem("token")
    const checkToken = await checkTokenValidity(token)

    if (guestSection && todoSection) {
        if (!token || token === 'null' || token === '') {
            guestSection.style.display = "flex";
            todoSection.style.display = "none";
            return null
        } else if (token && checkToken) {
            guestSection.style.display = "none";
            todoSection.style.display = "block";
        }
    }

};
async function displayUserTodos(todoObj) {
    const token = localStorage.getItem("token");
    const todoList = document.querySelector(".todo__list")
    const todos = await todoObj.todos
    if (!token || token === 'null' || token === '' || !todoList) { return null }
    const tokenValidity = await checkTokenValidity(token)
    if (!tokenValidity) { return }

    if (await todos.length === 0) {

    }
    await todos.forEach(element => {
        const li = document.createElement("li");
        li.classList.add("todo__item");
        li.innerHTML = `${element.todo}<button class="delete-button">Удалить</button>`
        todoList.appendChild(li)

    });
}

async function getUserId() {
    try {
        const token = localStorage.getItem("token");
        if (!token || token === 'null' || token === '') { return null; };
        const tokenValidity = await checkTokenValidity(token)
        if (!tokenValidity) { return null; };
        const userData = await getUserDataByToken(token);
        const userId = await userData.id;
        return userId;

    } catch (error) {
        console.error(`Ошибка при выполнении операции: ${error.message}`);
    }
}
