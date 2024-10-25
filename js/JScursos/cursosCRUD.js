import {
  Curso,
  saveCourses,
  getCourse,
  deleteCourse,
  updateCourse,
  onGetCourses,
} from "./cursosController.js";

/* aun no uso estas importaciones */
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

/* constantes - inputs de los modales */
const nombre = document.getElementById(`addNombreCurso`);
const imagen = document.getElementById(`inputImg`);
const descripcion = document.getElementById(`desCurso`);
const horas = document.getElementById(`duracionCurso`);
const requerimiento = document.getElementById(`reqCursos`);
let statusCurso = true;
let courseId; // Variable para almacenar el ID del curso a eliminar o editar
/* evento para cambiar el titulo del modal cursoModal */
let tituloModal = document.getElementById("modalLabel");
document.getElementById(`resCurso`).addEventListener(`click`, () => {
  tituloModal.textContent = "Registrar Curso";
  statusCurso = true;
});

/* CREATE curso */
/*modal y formulario del curso */

const formAddCurso = document.getElementById(`form-saveCurso`);

formAddCurso.addEventListener(`submit`, async (e) => {
  e.preventDefault();

  if (
    (nombre.value,
      imagen.files[0],
      descripcion.value,
      horas.value,
      requerimiento.value)
  ) {
    const curso = new Curso(
      nombre.value,
      imagen.files[0],
      descripcion.value,
      horas.value,
      requerimiento.value
    );
    try {
      if (statusCurso === true) {
        await saveCourses(curso);
      } else {
        await updateCourse(courseId, curso);
      }
    } catch (error) {
      alert("error: " + error);
    }

    const myModal = bootstrap.Modal.getInstance(
      document.getElementById("cursoModal")
    );
    myModal.hide(); // Cerrar el modal
    e.target.reset();
  } else {
    alert("llena los campos");
  }
});

/* READ cursos */
/* Variables */
var cantCourses = 0;
let maxVistaCourses = 6;
let allCourses =
  []; /* en este array almaceno los cursos para facilitar la busqueda */

const courseContainer = document.getElementById("coursesAdmin");
const searchInput = document.getElementById("searchInput");
const toggleButton = document.getElementById("toggleButton");

cargarCourses();

/* se cargan los cursos desde Firebase */
async function cargarCourses() {
  onGetCourses((querySnapshot) => {
    allCourses = []; // Reinicia/limpia el array de cursos
    courseContainer.innerHTML = "";
    cantCourses = 0;

    querySnapshot.forEach((doc) => {
      const course = { id: doc.id, ...doc.data() };

      allCourses.push(course);
      cantCourses++;
    });

    mostrarCursos(allCourses); // Muestra todos los cursos inicialmente
    maxVisCurso();
  });
}

/* carga en el div los cursos del array allCourses*/
function mostrarCursos(courses) {
  courseContainer.innerHTML = "";

  courses.forEach((course) => {
    const courseCard = document.createElement("div");

    courseCard.className = "crAdmin col-12 col-md-6 col-xl-4 mb-3";

    courseCard.innerHTML = `
    <div class="card min-width-card" style="background: #205aaf;">
      <div class="card-body text-white d-flex align-items-center">
        <figure class="mb-0 me-3">
          <img alt="" loading="lazy" width="100" height="100" decoding="async" data-nimg="1"  src="${course.image}" />
        </figure>
        <div class="flex-grow-1">
          <h5 class="card-title course-description mb-1">${course.title}</h5> 
          <p class="course-description mb-1">
            ${course.description}
          </p>
          <div class="d-flex gap-2 my-2"> <!-- Usar gap para espaciado entre botones -->
            <button title="Contenido" class="btn btn-secondary" data-id="${course.id}"><i class="fa-solid fa-folder-open"></i></button>
            <button title="Editar" class="btn  btn-primary btnEditar" data-id="${course.id}"><i class="fa-solid fa-pen-to-square"></i></button>
            <button title="Eliminar" class="btn btn-danger btnEliminar" data-id="${course.id}"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  `;

    courseContainer.appendChild(courseCard);
  });
  eliminarCourse();
  editarCourse();
  maxVisCurso();
}

/* Controla cuantos cursos se muestran segun maxVistaCourses */
function maxVisCurso() {
  const coursesElements = document.querySelectorAll(".crAdmin");
  coursesElements.forEach((course, index) => {
    course.style.display = index < maxVistaCourses ? "block" : "none";
  });
}

/* Evento para mostrar más o menos cursos */
toggleButton.addEventListener("click", () => {
  toggleButton.textContent = "Mostrar más cursos";

  if (toggleButton.textContent === "Mostrar más cursos" && cantCourses > 6) {
    maxVistaCourses = cantCourses;
    toggleButton.textContent = "Mostrar menos cursos";
  } else {
    maxVistaCourses = 6;
    toggleButton.textContent = "Mostrar más cursos";
  }

  maxVisCurso();
});

/* Filtrar los cursos según el texto ingresado */
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();

  const filteredCourses = allCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm)
  );

  mostrarCursos(filteredCourses); // Actualiza la lista de cursos filtrados
});

/*editar cursos */
/* estos botones se crea a para cada card de los cursos para editar, agregar content y eliminar*/

function editarCourse() {
  const btnEditar = courseContainer.querySelectorAll(".btnEditar");
  btnEditar.forEach((btn) =>
    btn.addEventListener("click", ({ target: { dataset } }) => {
      courseId = dataset.id;
      statusCurso = false;

      // se busca el curso por el id de la variable declarada arriab (courseId) xd
      tituloModal.textContent = "Editar curso";
      let courseToEdit = allCourses.find((course) => course.id === courseId);

      //lleno el form
      nombre.value = courseToEdit.title;
      descripcion.value = courseToEdit.description;
      horas.value = courseToEdit.duration;
      requerimiento.value = courseToEdit.requirements;
      document.getElementById(`imgCourse`).src = courseToEdit.image;

      // Abrir el modal
      const cursoModal = new bootstrap.Modal(
        document.getElementById("cursoModal")
      );
      cursoModal.show();
    })
  );
}

/* Eliminar cursos */
/* Eliminar curso */
function eliminarCourse() {
  const btnEliminar = courseContainer.querySelectorAll(".btnEliminar");

  btnEliminar.forEach((btn) =>
    btn.addEventListener("click", ({ target: { dataset } }) => {
      // Almacenar el ID del curso en la variable
      courseId = dataset.id;

      // Mostrar el modal de confirmación
      const confirmDeleteModal = new bootstrap.Modal(
        document.getElementById("confirmDeleteModal")
      );
      confirmDeleteModal.show();
    })
  );
}

// Manejar el clic en el botón de eliminar en el modal
document
  .getElementById("confirmDeleteButton")
  .addEventListener("click", async () => {
    try {
      await deleteCourse(courseId); // Llamar a la función de eliminación
      // Aquí puedes agregar código para actualizar la interfaz después de la eliminación, si es necesario
      alert("Curso eliminado");
    } catch (error) {
      console.error("Error al eliminar el curso:", error);
    }

    // Cerrar el modal después de eliminar
    const confirmDeleteModal = bootstrap.Modal.getInstance(
      document.getElementById("confirmDeleteModal")
    );
    confirmDeleteModal.hide();
  });
