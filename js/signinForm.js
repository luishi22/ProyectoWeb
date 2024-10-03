import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"
import { auth } from "./firebase.js"
import { showToast } from "./showToast.js"

const signingForm = document.querySelector('#signin-form')

signingForm.addEventListener('submit', async e => {
    e.preventDefault()

    const email = signingForm['signin-email'].value
    const password = signingForm['signin-password'].value

    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password)
        console.log(userCredentials)

        const signinModal = document.querySelector('#signinModal')
        const modal = bootstrap.Modal.getInstance(signinModal)

        modal.hide()
        
        showToast("Haz iniciado sesion con "+userCredentials.user.email)
    } catch (error) {
        if(error.code === "auth/wrong-password"){
            showToast("Contraseña incorrecta", "error")
        }else if(error.code === "auth/user-not-found"){
            showToast("Usuario no encontrado", "error")
        }else{
            showToast(error.message, "error")
        }
    }
})

