import { FacebookAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { auth } from "./firebase.js"
import { showToast } from "./showToast.js"
let userId
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

        const docRef1 = doc(db, "users", user.uid);
        const docSnap1 = await getDoc(docRef1);

        if (docSnap1.exists()) {
            userId = docSnap1.data().uid;
            localStorage.setItem("userId", userId);
            const rol = docSnap1.data().role;
            /* luishi - guardo el rol */
            localStorage.setItem(`rol`, rol);
            const actualPathname = window.location.pathname;
            if (actualPathname === "/html/cursos.html") {
              LinkCursos(actualPathname);
            } else if (actualPathname === "/html/certificacionesUser.html") {
              LinkCursos(actualPathname);
            }
          } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
          }
        } catch (error) {
          if (error.code === "auth/wrong-password") {
            showToast("Contraseña incorrecta", "error");
          } else if (error.code === "auth/user-not-found") {
            showToast("Usuario no encontrado", "error");
          } else {
            showToast(error.message, "error");
          }
        }
      });
      
      /* Luishi */
      const link = document.getElementById(`cursosLink`);
      link.addEventListener("click", () => {
        const actualPathname = "/html/cursos.html";
        LinkCursos(actualPathname);
      });
      
      const linkCertificaciones = document.getElementById(`certificacionesLink`);
      linkCertificaciones.addEventListener("click", () => {
        const actualPathname = "/html/certificacionesUser.html";
        LinkCursos(actualPathname);
      });
      
      function LinkCursos(actualPathname) {
        const rol = localStorage.getItem(`rol`) || "";
      
        if (rol === "Administrador") {
          link.href = "/html/cursosAdmin.html"; // Redirige a la página de administrador
          linkCertificaciones.href = "/html/certificacionesAdmin.html";
        } else {
          link.href = "/html/cursos.html"; // Redirige a la página de usuario
          linkCertificaciones.href = "/html/certificacionesUser.html";
        }
      
        if (actualPathname === "/html/cursos.html") {
          window.location.href = link.href;
        } else {
          window.location.href = linkCertificaciones;
        }
      }
      