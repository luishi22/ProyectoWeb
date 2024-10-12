import { signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"
import { auth } from "./firebase.js"
import { showToast } from "./showToast.js"

const logout = document.querySelector('#logout')

logout.addEventListener('click', async () => {
    await signOut(auth)
    //showToast("Se cerro la sesion de "+userCredentials.user.email)
    if (window.location.pathname === "/html/certificacionesUser.html") {
        location.reload(); 
    }
    localStorage.clear();
    console.log("cerraste sesion")
})