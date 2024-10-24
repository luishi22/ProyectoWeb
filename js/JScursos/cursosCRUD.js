import {
  Curso,
  saveCourses,
  getCourse,
  deleteCourse,
  updateCourse,
  onGetCourses,
} from "./cursosController.js";

/* constantes - inputs de los modales */
/* modal para agregar cursos */
const nombre = document.getElementById(`addNombreCurso`);
const imagen = document.getElementById(`inputImg`);
const descripcion = document.getElementById(`desCurso`);
const horas = document.getElementById(`duracionCurso`);
const requerimiento = document.getElementById(`reqCursos`);

/* variable para saber si quiere guardar o editar un curso */
let statusCurso = true;

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
const courseContainer = document.getElementById("coursesAdmin");
const searchInput = document.getElementById("searchInput");
const btnMostrarCourses = document.getElementById("buttonMostrar");
/* Variables */
let cantCourses = 0;
let maxVistaCourses = 6;
// Variable para almacenar el ID del curso a eliminar o editar
let courseId;

/* en este array almaceno los cursos para facilitar la busqueda */
let allCourses = [];

cargarCourses();

/* se cargan los cursos desde Firebase */
async function cargarCourses() {
  onGetCourses((querySnapshot) => {
    allCourses = []; // Reinicia/limpia el array de cursos
    cantCourses = 0;

    querySnapshot.forEach((doc) => {
      const course = { id: doc.id, ...doc.data() };

      allCourses.push(course);
      cantCourses++;
    });

    mostrarCursos(allCourses); // Muestra todos los cursos inicialmente
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
            <button class="btn btn-secondary btn-sm btnContent" data-id="${course.id}">Contenido</button>
            <button class="btn  btn-primary btn-sm btnEditar" data-id="${course.id}">Editar</button>
            <button class="btn btn-danger btn-sm btnEliminar" data-id="${course.id}">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  `;

    courseContainer.appendChild(courseCard);
  });
  maxVisCurso();
  eliminarCourse();
  editarCourse();
  contentCourse();
}

/* Controla cuantos cursos se muestran segun maxVistaCourses */
function maxVisCurso() {
  const coursesElements = document.querySelectorAll(".crAdmin");
  coursesElements.forEach((course, index) => {
    course.style.display = index < maxVistaCourses ? "block" : "none";
  });
}

/* Evento para mostrar más o menos cursos */
btnMostrarCourses.addEventListener("click", () => {
  if (
    btnMostrarCourses.textContent.trim() === "Mostrar más cursos" &&
    cantCourses > 6
  ) {
    maxVistaCourses = cantCourses;
    btnMostrarCourses.textContent = "Mostrar menos cursos";
  } else {
    maxVistaCourses = 6;
    btnMostrarCourses.textContent = "Mostrar más cursos";
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
document.getElementById("eliminarCurso").addEventListener("click", async () => {
  try {
    await deleteCourse(courseId); // Llamar a la función de eliminación
    // Aquí puedes agregar código para actualizar la interfaz después de la eliminación, si es necesario
    alert("Curso eliminado");
  } catch (error) {
    console.error("Error al eliminar el curso:", error);
  }

  // Cerrar el modal después de eliminar
  /* const tituloEliminar = document.getElementById("confirmDeleteModalLabel"); */

  const confirmDeleteModal = bootstrap.Modal.getInstance(
    document.getElementById("confirmDeleteModal")
  );
  confirmDeleteModal.hide();
});

//Manejo del clic en boton contenido del curso
import { mostrarContenidoCurso } from "./contentCourse.js";
function contentCourse() {
  const btnContent = courseContainer.querySelectorAll(".btnContent");
  btnContent.forEach((btn) =>
    btn.addEventListener("click", ({ target: { dataset } }) => {
      mostrarContenidoCurso(dataset.id);
    })
  );
}
