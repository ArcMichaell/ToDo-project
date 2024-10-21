import "../css/normalize.css"
import "../css/global.css"
import { login, getUserDataByToken, checkTokenValidity, updateToken } from "../js/api/auth";


document.addEventListener("DOMContentLoaded", async () => {
    const loginButton = document.querySelectorAll("#loginButton");
    initApp()

    //!Работа с модальным окном Логина
    const login_modalController = createModalController("loginModal");
    loginButton.forEach(el => {
        el.addEventListener("click", login_modalController);
    });

    document.getElementById("closeLoginModal").addEventListener("click", login_modalController);
    window.addEventListener("click", (event) => {
        const modal = document.getElementById("loginModal");
        if (event.target === modal) {
            login_modalController();
        }
    });
    // ? Отправка формы
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = document.getElementById("username-input").value;
        const password = document.getElementById("password-input").value;

        const tokens = await login(username, password);
        if (tokens) {
            const accessToken = tokens.accessToken;
            const refreshToken = tokens.refreshToken;
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken)
            await displayUser(accessToken);
            login_modalController();
        }else {
            console.log("Неверно указаны данные");
            
        }

    })


 
})


async function initApp() {
    try {
        const loginButton = document.querySelectorAll("#loginButton");
        const token = localStorage.getItem("token")
        if (token && token !== "null" && token !== false && checkTokenValidity(token)) {
            const userData = await getUserDataByToken(token);
            displayUser(userData);

            
        } else {
            await updateToken();
            const newToken = await localStorage("token");
            if (newToken) {
                await initApp()
            } else {
                loginButton.forEach(el => {
                    el.style.display = "flex";
                })
                throw new Error('Network response was not ok');
            }
        }

    } catch (error) {
        console.log("Попробуйте авторизоваться снова. Неизвестная ошибка", error);

    }

}

function createModalController(modalId) {
    let isOpen = false
    return function toggleControl() {
        const modal = document.getElementById(`${modalId}`)
        isOpen = !isOpen
        if (isOpen) {
            modal.style.display = "block"
        } else {
            modal.style.display = "none"
        }
    }
}


export async function displayUser(userData) {
    const userInfo = document.getElementById('user-info');
    const loginButton = document.querySelectorAll("#loginButton");
    try {
        if (!userData) {
            throw new Error('Network response was not ok');
        }
        userInfo.style.display = "flex";
        loginButton.forEach(el => {
            el.style.display = "none";
        });
        document.getElementById('user-avatar').src = userData.image;
        document.getElementById('username').innerText = userData.username;
    } catch (error) {
        console.error('Error during login:', error);
    }


};

