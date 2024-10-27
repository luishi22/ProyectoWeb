import {
  onGetContetCourseById,
  getCourse,
  onGetCourses,
} from "./cursosController.js";
let idCourse = "";
let allContet = [];
let allCourses = [];
// Función para obtener el ID de la URL
function getIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

document.addEventListener("DOMContentLoaded", () => {
  idCourse = getIdFromUrl();
  // Aquí puedes usar idCourse para cargar los detalles del curso desde Firestore
  console.log("ID del curso:", idCourse);
  // Lógica para cargar detalles del curso usando idCourse
  if (idCourse === null) {
    document
      .getElementById("mensajeSeleccionarCurso")
      .classList.remove("d-none");
    document.getElementById("contenido").classList.add("d-none");
    cargarCourses();
  } else {
    document.getElementById("mensajeSeleccionarCurso").classList.add("d-none");
    document.getElementById("contenido").classList.remove("d-none");
    cargarDatosCurso();
    cargarConent();
  }
});

/* se cargan los cursos desde Firebase */
async function cargarCourses() {
  onGetCourses((querySnapshot) => {
    allCourses = []; // Reinicia/limpia el array de cursos

    querySnapshot.forEach((doc) => {
      const course = { id: doc.id, ...doc.data() };

      allCourses.push(course);
    });

    mostrarCursos(allCourses); // Muestra todos los cursos inicialmente
  });
}

/* carga en el div los cursos del array allCourses*/
function mostrarCursos(courses) {
  const courseContainer = document.getElementById("coursesAdmin");
  courseContainer.innerHTML = "";

  courses.forEach((course) => {
    const courseCard = document.createElement("div");

    courseCard.className = "crAdmin col-12 col-md-6 col-xl-4 mb-3";

    courseCard.innerHTML = `
    <div class="card min-width-card" style="background: #205aaf;">
       <a href="/html/cursos.html?id=${course.id}" style="text-decoration: none; color: white;" class="card-body text-white d-flex align-items-center">
        <figure class="mb-0 me-3">
          <img alt="" loading="lazy" width="100" height="100" decoding="async" data-nimg="1"  src="${course.image}" />
        </figure>
        <div class="flex-grow-1">
          <h5 class="card-title course-description mb-1">${course.title}</h5> 
          <p class="course-description mb-1">
            ${course.description}
          </p>      
        </div>
      </a>
    </div>
  `;

    /*      <li class="TemaCartas" style="--color:#59A15B;--color2:#39909D">
            <a href="./html/cursos.html?id=${doc.id}" style="text-decoration: none; color: white;">
              <img src="${course.image}" 
                   alt="" loading="lazy" width="56" height="56" decoding="async" style="color:transparent">
              <h5 class="card-title">${course.title}</h5>
            </a>
          </li>`; */

    courseContainer.appendChild(courseCard);
  });
}

/* Filtrar los cursos según el texto ingresado */
document.getElementById("searchInput").addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();

  const filteredCourses = allCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm)
  );

  mostrarCursos(filteredCourses); // Actualiza la lista de cursos filtrados
});

async function cargarConent() {
  try {
    await onGetContetCourseById(idCourse, (querySnapshot) => {
      allContet = []; // Reinicia/limpia el array de cursos

      querySnapshot.forEach((doc) => {
        const content = { id: doc.id, ...doc.data() };
        allContet.push(content);
      });

      viewContent(); // Muestra todos los cursos inicialmente
    });
  } catch (error) {
    console.error("Error al cargar contenido del curso:", error);
    alert("Error al cargar contenido del curso");
  }
}

async function viewContent() {
  const contaier = document.getElementById("accordionExample");
  contaier.innerHTML = "";
  let cant = 0;

  allContet.forEach((video, index) => {
    cant++;
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `

      <div class="card-header" id="heading${index}">
        <h5 class="mb-0">
          <button
            class="btn btn-link"
            type="button"
            data-toggle="collapse"
            data-target="#collapse${index}"
            aria-expanded="true"
            aria-controls="collapse${index}"
          >
            <strong>Clase #${index + 1}</strong>
          </button>
        </h5>
      </div>

      <div
        id="collapse${index}"
        class="collapse"
        aria-labelledby="heading${index}"
        data-parent="#accordionExample"
      >
        <div class="card-body">
          
            <div class="card" style="background: #205aaf;">
              <div class="card-body text-white">
                <h5 class="card-title">${video.videoTitle}</h5>
                <iframe width="100%" height="200" src="${
                  video.videoURL
                }" title="YouTube video" allowfullscreen loading="lazy"></iframe>
                <p class="card-text">
                Descripcion:<br>
                ${video.videoDescription}
                </p>
              </div>
            </div>
          </div>
        
      </div>
    `;
    contaier.appendChild(div);
  });
  document.getElementById(
    "cantClases"
  ).textContent = `Clases del curso: ${cant}`;
}

async function cargarDatosCurso() {
  try {
    const doc = await getCourse(idCourse);
    const course = doc.data();
    // Llenar la sección de contenido

    document.getElementById(
      "tema"
    ).textContent = `Temario del Curso de ${course.title}`;
    document.getElementById(`horasCurso`).innerHTML = `
  <i class="fa-regular fa-clock me-1"></i>
  <strong>${course.duration} Horas</strong> de contenido`;

    const requisitosArray = course.requirements.split(","); // Separa la cadena en un array

    const listaRequisitos = document.getElementById("listaRequerimientos");

    requisitosArray.forEach((requisito) => {
      const li = document.createElement("li"); // Crea un nuevo elemento de lista
      li.innerHTML = `
      <span class="text-success">&#9679;</span> ${requisito.trim()}
    `;
      listaRequisitos.appendChild(li); // Agrega el elemento a la lista
    });
  } catch (error) {}
}
