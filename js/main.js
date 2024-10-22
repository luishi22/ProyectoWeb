/** CODIGO DEL LOGIN AND SIGIN */
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { auth } from "./firebase.js";
import { loginCheck } from "./loginCheck.js";
import "./signupForm.js";
import "./signinForm.js";
import "./googleLogin.js";
import "./facebookLogin.js";
import "./logout.js";
import "./updateProfile.js";

onAuthStateChanged(auth, async (user) => {
  loginCheck(user);

  /* if(user){
        loginCheck(user);
    }else{
        loginCheck(user);
    } */
});
/** FIN DE CODIGO DEL LOGIN AND SIGIN */

/**
 * CODIGO PARA EL MAIN
 */
// Inicializar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDzIK9G9v1NalhLyQZW83z2IG3Qi8vDuxs",
  authDomain: "appcursos-4f990.firebaseapp.com",
  databaseURL: "https://appcursos-4f990-default-rtdb.firebaseio.com",
  projectId: "appcursos-4f990",
  storageBucket: "appcursos-4f990.appspot.com",
  messagingSenderId: "105350704501",
  appId: "1:105350704501:web:42aa697e8ae87cb9e7773c",
  measurementId: "G-47T2BW6XX2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentCourses = 6;
let showingAll = false; // Variable para controlar si se muestran todos los cursos o solo 3

// Cargar los cursos desde Firestore y mostrarlos en el contenedor
function loadCoursesFromFirestore(searchTerm = "") {
  const coursesRef = collection(db, "courses");
  const courseContainer = document.getElementById("courseContainer");

  // Obtener los cursos en tiempo real
  onSnapshot(coursesRef, (snapshot) => {
    courseContainer.innerHTML = ""; // Limpiar el contenedor antes de mostrar los cursos
    const row = document.createElement("div");
    row.className = "row g-1";

    snapshot.forEach((doc, index) => {
      const course = doc.data();

      // Filtrar los cursos en función del término de búsqueda
      if (course.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        const col = document.createElement("div");
        col.className = "cardContainer col-12 col-md-6 col-lg-4";
        col.innerHTML = `
          <li class="TemaCartas" style="--color:#59A15B;--color2:#39909D">
            <a href="./html/cursos.html?id=${doc.id}" style="text-decoration: none; color: white;">
              <img src="${course.image}" 
                   alt="" loading="lazy" width="56" height="56" decoding="async" style="color:transparent">
              <h5 class="card-title">${course.title}</h5>
            </a>
          </li>`;
        row.appendChild(col);
      }
      
    });

    courseContainer.appendChild(row); // Añadir la fila con todos los cursos
    updateCourseVisibility(); // Actualizar la visibilidad de los cursos para mostrar solo los primeros 3
  }, (error) => {
    console.error("Error al leer los cursos:", error);
  });
}

// Función para actualizar la visibilidad de los cursos
function updateCourseVisibility() {
  const coursesElements = document.querySelectorAll(".cardContainer");
  coursesElements.forEach((course, index) => {
    course.style.display = index < currentCourses ? "block" : "none";
  });
}

// Función para alternar entre mostrar todos los cursos o solo 3
function toggleCourseVisibility() {
  const toggleButton = document.getElementById("toggleButton");

  if (showingAll) {
    // Mostrar solo 3 cursos
    currentCourses = 6;
    toggleButton.textContent = "Mostrar más cursos";
  } else {
    // Mostrar todos los cursos
    currentCourses = document.querySelectorAll(".cardContainer").length;
    toggleButton.textContent = "Mostrar menos cursos";
  }

  showingAll = !showingAll; // Cambiar el estado
  updateCourseVisibility();
}

// Llamar a la función para cargar los cursos desde Firestore
document.addEventListener("DOMContentLoaded", () => {
  loadCoursesFromFirestore(); // Cargar todos los cursos al inicio

  // Evento para alternar entre mostrar más o menos cursos
  const toggleButton = document.getElementById("toggleButton");
  toggleButton.addEventListener("click", toggleCourseVisibility);

  // Filtrar los cursos según el término ingresado en el campo de búsqueda
  const searchInput = document.getElementById("autocomplete-0-input");
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value;
    loadCoursesFromFirestore(searchTerm); // Cargar los cursos filtrados
  });
});




document.getElementById("toggleButton").addEventListener("click", () => {
  if (currentCourses === coursesPerPage) {
    currentCourses = totalCourses;
    document.getElementById("toggleButton").textContent =
      "Mostrar menos cursos";
  } else {
    currentCourses = coursesPerPage;
    document.getElementById("toggleButton").textContent = "Mostrar más cursos";
  }
  updateCourseVisibility();
});

generateCourses();
/** FIN DE CODIGO PARA EL MAIN */
