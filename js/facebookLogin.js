import { FacebookAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { auth } from "./firebase.js"
import { showToast } from "./showToast.js"

const btnFacebook = document.querySelector('#btnFacebook')

btnFacebook.addEventListener('click', async () => {
    const provider = new FacebookAuthProvider()
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

        //showToast("Bienvenido "+userCredentials.user.displayName)
    } catch (error) {
        console.log(error.code);
    }
})