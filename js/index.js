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

let currentCourses = 3;
let showingAll = false;

function loadCoursesFromFirestore(searchTerm = "") {
  const coursesRef = collection(db, "courses");
  const courseContainer = document.getElementById("courseContainer");

  onSnapshot(coursesRef, (snapshot) => {
    courseContainer.innerHTML = "";
    const row = document.createElement("div");
    row.className = "row g-1";

    let courseCount = 0;

    snapshot.forEach((doc) => {
      const course = doc.data();
      if (course.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        const col = document.createElement("div");
        col.className = "cardContainer col-12 col-md-6 col-lg-4";
        col.innerHTML = `
          <li class="TemaCartas" style="--color:#59A15B;--color2:#39909D">
            <a href="./html/cursos.html?id=${doc.id}" style="text-decoration: none; color: white;">
              <img src="${course.image}" alt="" loading="lazy" width="56" height="56" decoding="async" style="color:transparent">
              <h5 class="card-title">${course.title}</h5>
            </a>
          </li>`;
        row.appendChild(col);
        courseCount++;
      }
    });

    courseContainer.appendChild(row);
    updateCourseVisibility();

    const toggleButton = document.getElementById("toggleButton");
    toggleButton.style.display = courseCount > 3 ? "block" : "none";
  }, (error) => {
    console.error("Error al leer los cursos:", error);
  });
}

function updateCourseVisibility() {
  const coursesElements = document.querySelectorAll(".cardContainer");
  coursesElements.forEach((course, index) => {
    course.style.display = index < currentCourses ? "block" : "none";
  });
}

function toggleCourseVisibility() {
  const toggleButton = document.getElementById("toggleButton");

  if (showingAll) {
    currentCourses = 3;
    toggleButton.textContent = "Mostrar más cursos";
  } else {
    currentCourses = document.querySelectorAll(".cardContainer").length;
    toggleButton.textContent = "Mostrar menos cursos";
  }

  showingAll = !showingAll;
  updateCourseVisibility();
}

document.addEventListener("DOMContentLoaded", () => {
  loadCoursesFromFirestore();

  const toggleButton = document.getElementById("toggleButton");
  toggleButton.addEventListener("click", toggleCourseVisibility);

  const searchInput = document.getElementById("autocomplete-0-input");
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value;
    loadCoursesFromFirestore(searchTerm);
  });
});