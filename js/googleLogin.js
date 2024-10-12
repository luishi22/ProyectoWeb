import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { auth } from "./firebase.js"
import { showToast } from "./showToast.js"
 let userId;

const btnGoogle = document.querySelector('#btnGoogle')


btnGoogle.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider()
    const db = getFirestore()
    
    try {
        const userCredentials = await signInWithPopup(auth, provider)
        const user = userCredentials.user
        const uid = user.uid

        const userDocRef = doc(db, "users", uid)
        const userDoc = await getDoc(userDocRef)


        if(!userDoc.exists()){
            await setDoc(userDocRef, {
                displayName: user.displayName,
                email: user.email,
                role: "Usuario", 
                uid: uid
            })

            showToast("Bienvenido " + user.displayName)
        }else{
            showToast("Bienvenido de nuevo " + user.displayName)
        }
        console.log(user)


        const signinModal = document.querySelector('#signinModal')
        const modal = bootstrap.Modal.getInstance(signinModal)
        modal.hide()

        const docRef1 = doc(db, "users", user.uid);
        const docSnap1 = await getDoc(docRef1);

        if (docSnap1.exists()) {
            if (window.location.pathname === "/html/certificacionesUser.html") {
                location.reload(); 
            }
            console.log("Document data:", docSnap1.data());
            userId= docSnap1.data().uid
            localStorage.setItem('userId', userId);
           const rol=docSnap1.data().role
            console.log(userId)
            const certificacionesLink= document.getElementById("certificacionesLink")
            if (rol === "Admin") {
               certificacionesLink.href = "/html/certificacionesAdmin.html";  // Redirige a la página de administrador
            } else if (rol === "Usuario") {
                certificacionesLink.href = "/html/certificacionesUser.html";  // Redirige a la página de usuario
            } else {
                //window.location.href = "default.html";  // Redirige a una página por defecto si el rol no coincide
            }
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
        //showToast("Bienvenido "+userCredentials.user.displayName)
    } catch (error) {
        console.log(error.code);
    }
})