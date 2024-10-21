import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
  getFirestore,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { auth } from "./firebase.js";
import { showToast } from "./showToast.js";
let userId;
const signingForm = document.querySelector("#signin-form");
signingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = signingForm["signin-email"].value;
  const password = signingForm["signin-password"].value;

  const db = getFirestore();

  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredentials.user;

    const signinModal = document.querySelector("#signinModal");
    const modal = bootstrap.Modal.getInstance(signinModal);
    modal.hide();

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    showToast("Haz iniciado sesion con " + userCredentials.user.email);

    if (docSnap.exists()) {
      userId = docSnap.data().uid;
      localStorage.setItem("userId", userId);
      const rol = docSnap.data().role;
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
