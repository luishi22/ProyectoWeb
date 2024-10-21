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
    console.log(userCredentials);
    const user = userCredentials.user;

    const signinModal = document.querySelector("#signinModal");
    const modal = bootstrap.Modal.getInstance(signinModal);

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    const rol = docSnap.data().role;

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      userId = docSnap.data().uid;
      localStorage.setItem("userId", userId);
      const rol = docSnap.data().role;
      console.log(userId);
      const certificacionesLink = document.getElementById(
        "certificacionesLink"
      );
      if (rol === "Administrador") {
        certificacionesLink.href = "/html/certificacionesAdmin.html"; // Redirige a la página de administrador
        window.location.href = certificacionesLink.href;
      } else if (rol === "Usuario") {
        certificacionesLink.href = "/html/certificacionesUser.html"; // Redirige a la página de usuario
        window.location.href = certificacionesLink.href;
      } else {
        certificacionesLink.href = "/html/certificacionesUser.html"; // Redirige a una página por defecto si el rol no coincide
      }
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }

    showToast("Haz iniciado sesion con " + userCredentials.user.email);

    if (docSnap.exists()) {
      if (window.location.pathname === "/html/certificacionesUser.html") {
        location.reload();
      } else if (
        window.location.pathname === "/html/certificacionesAdmin.html"
      ) {
        location.reload();
      }
      console.log("Document data:", docSnap.data());
      userId = docSnap.data().uid;
      localStorage.setItem("userId", userId);
      const rol = docSnap.data().role;

      /* luishi - guardo el rol */
      localStorage.setItem(`rol`, rol);

      if (window.location.pathname === "/html/cursos.html") {
        LinkCursos();
      }

      console.log(userId);
      const certificacionesLink = document.getElementById(
        "certificacionesLink"
      );
      if (rol === "Administrador") {
        certificacionesLink.href = "/html/certificacionesAdmin.html"; // Redirige a la página de administrador
      } else if (rol === "Usuario") {
        certificacionesLink.href = "/html/certificacionesUser.html"; // Redirige a la página de usuario
      } else {
        //certificacionesLink.href = "/html/certificacionesUser.html";   // Redirige a una página por defecto si el rol no coincide
        console.log("no hay user");
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
link.addEventListener("click", () => LinkCursos());

function LinkCursos() {
  const rol = localStorage.getItem(`rol`) || "";
  if (rol === "Administrador") {
    link.href = "/html/cursosAdmin.html"; // Redirige a la página de administrador
  } else {
    link.href = "/html/cursos.html"; // Redirige a la página de usuario
  }

  window.location.href = link.href;
}
