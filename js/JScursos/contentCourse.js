import {
  getCourse,
  saveContent,
  onGetContetCourseById,
  updateContent,
  deleteContent,
} from "./cursosController.js";
import { showToast } from "../../js/showToast.js";
/* seccion de agregar contenido */
// Variables para el nuevo contenido
const contentSection = document.getElementById("contentSection");
const backButton = document.getElementById("backButton");
const courseTitle = document.getElementById("courseTitle");
const courseImage = document.getElementById("courseImage");
const courseDescription = document.getElementById("courseDescription");
const videosContainer = document.getElementById("videosContainer");
const tituloModalVideo = document.getElementById("videoModalLabel");
let allContet = [];
let idCourse = 0;
let idVideo = 0;
let statusCurso = true;

// Mostrar contenido del curso
export async function mostrarContenidoCurso(id) {
  idCourse = id;
  const doc = await getCourse(id);
  const course = doc.data();
  // Llenar la sección de contenido
  courseTitle.textContent = course.title;
  courseImage.src = course.image;
  courseDescription.textContent = course.description;

  // Ocultar la sección de cursos y mostrar la sección de contenido
  coursesSection.classList.add("d-none");
  contentSection.classList.remove("d-none");

  // cargar las cards
  cargarConent();
}

// Regresar a la sección de cursos
backButton.addEventListener("click", () => {
  contentSection.classList.add("d-none");
  coursesSection.classList.remove("d-none");
});

document
  .getElementById("addVideoButton")
  .addEventListener(
    "click",
    () => (tituloModalVideo.textContent = "Agregar Video")
  );

/* Agregar videos */
// Manejar la adición de videos
const formAddVideo = document.getElementById("form-addVideo");
formAddVideo.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputs = {
    idCourse: idCourse,
    videoTitle: document.getElementById("videoTitle").value.trim(),
    videoDescription: document.getElementById("videoDescription").value.trim(),
    videoURL: document.getElementById("videoURL").value.trim(),
  };

  const verificacion = Object.values(inputs).every((field) => field !== "");

  if (verificacion) {
    if (statusCurso) {
      addContent(inputs);
    } else {
      updateContent(idVideo, inputs);
    }
  } else {
  }
  // Cerrar el modal y limpiar el formulario
  const videoModal = bootstrap.Modal.getInstance(
    document.getElementById("videoModal")
  );
  videoModal.hide();

  formAddVideo.reset();
});

async function addContent(inputs) {
  try {
    await saveContent(inputs);
  } catch (error) {
    alert("error al guardar video");
  }
}

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

function crearTarjeta(video) {
  return `
    <div class="col-12 col-md-6 col-xl-4 mb-3">
      <div class="card" style="background: #205aaf;">
        <div class="card-body text-white">
          <h5 class="card-title">${video.videoTitle}</h5>
          <iframe width="100%" height="200" src="${video.videoURL}" title="YouTube video" allowfullscreen loading="lazy"></iframe>
          <p class="card-text">${video.videoDescription}</p>
          <button type="button" class="btn btn-primary btnEditarVideo" data-id="${video.id}">Editar</button>
          <button type="button" class="btn btn-danger btnEliminarVideo" data-id="${video.id}">Eliminar</button>
        </div>
      </div>
    </div>
  `;
}

async function viewContent() {
  videosContainer.innerHTML = ""; // Limpiar el contenedor

  const videoCards = allContet.map((video) => crearTarjeta(video)).join("");

  videosContainer.innerHTML = videoCards;

  editarVideo();
  eliminarVideo();
}

function editarVideo() {
  const btnEditar = videosContainer.querySelectorAll(".btnEditarVideo");
  btnEditar.forEach((btn) =>
    btn.addEventListener("click", ({ target: { dataset } }) => {
      idVideo = dataset.id;
      statusCurso = false;

      // se busca el curso por el id de la variable declarada arriab (courseId) xd
      tituloModalVideo.textContent = "Editar video";
      let videoToEdit = allContet.find((video) => video.id === idVideo);

      document.getElementById("videoTitle").value = videoToEdit.videoTitle;
      document.getElementById("videoDescription").value =
        videoToEdit.videoDescription;
      document.getElementById("videoURL").value = videoToEdit.videoURL;

      // Abrir el modal
      const cursoModal = new bootstrap.Modal(
        document.getElementById("videoModal")
      );
      cursoModal.show();
    })
  );
}

/* Eliminar curso */
function eliminarVideo() {
  const btnEliminar = videosContainer.querySelectorAll(".btnEliminarVideo");

  btnEliminar.forEach((btn) =>
    btn.addEventListener("click", ({ target: { dataset } }) => {
      // Almacenar el ID del curso en la variable
      idVideo = dataset.id;

      // Mostrar el modal de confirmación
      const confirmDeleteModal = new bootstrap.Modal(
        document.getElementById("confirmarVideoDelete")
      );
      confirmDeleteModal.show();
    })
  );
}

// Manejar el clic en el botón de eliminar en el modal
document.getElementById("eliminarVideo").addEventListener("click", async () => {
  try {
    await deleteContent(idVideo);
  } catch (error) {
    console.error("Error al eliminar el video:", error);
  }

  // Cerrar el modal después de eliminar
  const confirmDeleteModal = bootstrap.Modal.getInstance(
    document.getElementById("confirmarVideoDelete")
  );
  confirmDeleteModal.hide();
});
