import {
  Curso,
  saveCourses,
  getCourse,
  deleteCourse,
  updateCourse,
  onGetCourses,
} from "./cursosController.js";

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

/*id del formulario form-saveCurso */

/* CREATE curso */
document
  .getElementById(`form-saveCurso`)
  .addEventListener(`submit`, async (e) => {
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
        await saveCourses(curso);
      } catch (error) {
        alert("error: " + error);
      }
    } else {
      alert("llena los campos");
    }
  });
