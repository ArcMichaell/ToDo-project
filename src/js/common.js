import "../css/normalize.css"
import "../css/global.css"
import { login, getUserDataByToken, checkTokenValidity } from "../js/api/auth";


document.addEventListener("DOMContentLoaded", async () => {
    initApp()
    //!Работа с модальным окном Логина
    const loginButton = document.querySelectorAll("#loginButton")
    const login_modalController = createModalController("loginModal");
    loginButton.forEach(el => {
        el.addEventListener("click", login_modalController);
    });



    document.getElementById("loginButton").addEventListener("click", login_modalController);
    document.getElementById("closeLoginModal").addEventListener("click", login_modalController);

    window.addEventListener("click", (event) => {
        const modal = document.getElementById("loginModal");
        if (event.target === modal) {
            login_modalController();
        }
    });
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
            localStorage.setItem("refreshToken", refreshToken);

            await displayUser(accessToken);
            login_modalController();
        }

    })





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

})


async function initApp() {
    const token = localStorage.getItem("token");
    const loginButton = document.querySelectorAll("#loginButton")


    if (token !== "null" &&
        token !== false &&
        token !== null &&
        await checkTokenValidity(token)
    ) {
        displayUser(token)
    } else {
        loginButton.forEach(el => {
            el.style.display = "flex";
        })
    }

}


export async function displayUser(token) {
    const userData = await getUserDataByToken(token)
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
