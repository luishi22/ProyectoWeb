import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { auth } from "./firebase.js"
import { showToast } from "./showToast.js"
let userId
const signingForm = document.querySelector('#signin-form')
signingForm.addEventListener('submit', async e => {
    e.preventDefault()

    const email = signingForm['signin-email'].value
    const password = signingForm['signin-password'].value
    
    const db = getFirestore();

    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password)
        console.log(userCredentials)
        const user = userCredentials.user;

        const signinModal = document.querySelector('#signinModal')
        const modal = bootstrap.Modal.getInstance(signinModal)

        modal.hide()
        
        showToast("Haz iniciado sesion con "+userCredentials.user.email)

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            
            console.log("Document data:", docSnap.data());
            userId= docSnap.data().uid
            localStorage.setItem('userId', userId);
            const rol=docSnap.data().role
            console.log(userId)
            const certificacionesLink= document.getElementById("certificacionesLink")
            if (rol === "Administrador") {
               certificacionesLink.href = "/html/certificacionesAdmin.html";  // Redirige a la página de administrador
               //window.location.href = certificacionesLink.href;  
            } else if (rol === "Usuario") {
                certificacionesLink.href = "/html/certificacionesUser.html";  // Redirige a la página de usuario
                //window.location.href = certificacionesLink.href;  
            } else {
                certificacionesLink.href = "/html/certificacionesUser.html";   // Redirige a una página por defecto si el rol no coincide
                
            }
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }

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

