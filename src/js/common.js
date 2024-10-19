import "../css/normalize.css"
import "../css/global.css"
import { login, getUserDataByToken, checkTokenValidity, updateToken } from "../js/api/auth";
import { toggleTodoDisplay } from "./todo";

let isFunctionCalled = false;
document.addEventListener("DOMContentLoaded", async () => {
    if(!isFunctionCalled){ 
        isFunctionCalled = true;
    const loginButton = document.querySelectorAll("#loginButton");

    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    if ( token && refreshToken ){
        if(await checkTokenValidity(token)){
            await displayUser(token)
            await toggleTodoDisplay()
        }else {
            const newToken  = await updateToken(refreshToken)
            localStorage.setItem("token", newToken)
            await displayUser(newToken)
            await toggleTodoDisplay()
        }
        
    }else{
        loginButton.forEach(el=>{
            el.style.display = "flex";
        })
    }

   


    //!Работа с модальным окном Логина
   
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
            localStorage.setItem("refreshToken", refreshToken)

            await displayUser(accessToken);
            await toggleTodoDisplay()
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
    }
})

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

