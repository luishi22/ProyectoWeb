import { app } from "../firebase.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

import { showToast } from "../showToast.js";

export class Curso {
  constructor(title, image, description, duration, requirements) {
    this.title = title;
    this.image = image;
    this.description = description;
    this.duration = duration;
    this.requirements = requirements;
  }
}

const db = getFirestore(app);
const storage = getStorage(app);

export const saveCourses = async (curso) => {
  try {
    /* creo de la referencia en Firebase Storage */
    const storageRef = ref(storage, `course-images/${curso.image.name}`);

    /* aqui se sube la imagen */
    const snapshot = await uploadBytes(storageRef, curso.image);

    /* ontengo la URL de descarga de la imagen */
    const downloadURL = await getDownloadURL(snapshot.ref);

    /* actua el campo imagen con la URL obtenida */
    curso.image = downloadURL;

    // Guardar el curso en Firestore lo paso a string porque no acepta objetos de clases
    await setDoc(
      doc(collection(db, `courses`)),
      JSON.parse(JSON.stringify(curso))
    );
    showToast("Curso creado con éxito.");
  } catch (error) {
    showToast("Hubo un error al crear el curso, inténtalo de nuevo.", "error");
  }
};

export const getCourse = (id) => getDoc(doc(db, `courses`, id));

export const deleteCourse = (id) => deleteDoc(doc(db, `courses`, id));

export const updateCourse = async (id, curso) => {
  try {
    /* creo de la referencia en Firebase Storage */
    const storageRef = ref(storage, `course-images/${curso.image.name}`);

    const snapshot = await uploadBytes(storageRef, curso.image);

    const downloadURL = await getDownloadURL(snapshot.ref);

    curso.image = downloadURL;

    // actualiza el curso en Firestore lo paso a string porque no acepta objetos de clases

    await updateDoc(doc(db, `courses`, id), JSON.parse(JSON.stringify(curso)));
    showToast("Edicion del curso finalizada.");
  } catch (error) {
    showToast(
      "Hubo un error al actualizado el curso, inténtalo de nuevo.",
      "error"
    );
  }
};

export const onGetCourses = (callback) =>
  onSnapshot(collection(db, `courses`), callback);

/* contenido del curso */

export const saveContent = async (courseContent) => {
  try {
    // Guardar el curso en Firestore lo paso a string porque no acepta objetos de clases
    await setDoc(
      doc(collection(db, `coursesContent`)),
      JSON.parse(JSON.stringify(courseContent))
    );
    showToast("Contenido agregado exitosamente.");
  } catch (error) {
    alert("error, al cargar los cursos", "error");
  }
};

export const updateContent = async (id, courseContent) => {
  try {
    await updateDoc(
      doc(db, `coursesContent`, id),
      JSON.parse(JSON.stringify(courseContent))
    );
    showToast("Contenido editado exitosamente.");
  } catch (error) {
    alert("Hubo un error al actualizado el contenido del curso.");
  }
};

export const deleteContent = (id) => {
  deleteDoc(doc(db, `coursesContent`, id));
  showToast("Contenido eliminado exitosamente.");
};

export const onGetContetCourseById = async (idCourse, callback) => {
  const consulta = query(
    collection(db, "coursesContent"),
    where("idCourse", "==", idCourse)
  );
  onSnapshot(consulta, callback);
};
