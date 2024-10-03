import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { auth } from './firebase.js'
import { showToast } from "./showToast.js"

const signupForm = document.querySelector('#signup-form')

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const displayName = signupForm['singup-displayName'].value;
    const email = signupForm['singup-email'].value;
    const password = signupForm['singup-password'].value;
    const role = "Usuario";
    
    const db = getFirestore();

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {displayName});

        await setDoc(doc(db, "users", user.uid), {
            email,
            displayName,
            role,
            uid: user.uid,
        });
        
        console.log(user);

        const signupModal = document.querySelector('#signupModal')
        const modal = bootstrap.Modal.getInstance(signupModal)

        modal.hide()
        showToast("Bienvenido "+ userCredential.user.displayName)

    } catch (error) {
        console.log(error.message)
        console.log(error.code)
        if(error.code === 'auth/email-already-in-use'){
            showToast("Correo ya esta en uso", "error")
        }else if(error.code === 'auth/invalid-email'){
            showToast("Correo es invalido", "error")
        }else if(error.code === 'auth/weak-password'){
            showToast("Contraseña insegura", "error")
        }else if(error.code){
            showToast("Algo salio mal", "error")
        }
    }
})
