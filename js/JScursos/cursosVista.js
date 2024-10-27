import { showToast } from "../showToast.js";

/* inputImg es una constante del input tipo file para seleccionar img */
const inputImg = document.getElementById("inputImg");

inputImg.addEventListener("change", ({ target: { files } }) => {
  const file = files[0];
  const imgElement = document.getElementById("imgCourse");

  // Validar que el archivo sea una imagen (MIME type)
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = function (e) {
      // Actualiza el src de la imagen con la nueva imagen seleccionada
      imgElement.src = e.target.result;
    };

    reader.readAsDataURL(file); // Lee la imagen como Data URL
  } else {
    showToast("Por favor, selecciona un archivo de imagen válido.", "error");
    inputImg.value = "";
  }
});

/* boton para cerrar el modal de addCursos */
document.getElementById("closeModalCurso").addEventListener(`click`, (e) => {
  const imgElement = document.getElementById("imgCourse");
  imgElement.src = `../assets/icons/iconosCursos/iconBaseCurso.png`;
  inputImg.value = "";

  document.getElementById(`addNombreCurso`).value = "";
  document.getElementById(`inputImg`).value = "";
  document.getElementById(`desCurso`).value = "";
  document.getElementById(`duracionCurso`).value = "";
  document.getElementById(`reqCursos`).value = "";
});
