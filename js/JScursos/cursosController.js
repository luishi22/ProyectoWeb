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
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

export class Curso {
  constructor(nombre, imagen, descripcion, duracion, requerimientos) {
    this.nombre = nombre;
    this.imagen = imagen;
    this.descripcion = descripcion;
    this.duracion = duracion;
    this.requerimientos = requerimientos;
  }
}

const db = getFirestore(app);
const storage = getStorage(app);

export const saveCourses = async (curso) => {
  try {
    /* creacion de la referencia en Firebase Storage */
    const storageRef = ref(storage, `course-images/${curso.imagen.name}`);

    /* Subir la imagen */
    const snapshot = await uploadBytes(storageRef, curso.imagen);
    console.log("Imagen subida:", snapshot);

    /* ontengo la URL de descarga de la imagen */
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("URL de la imagen:", downloadURL);

    /* actua el campo imagen con la URL obtenida */
    curso.imagen = downloadURL;
    console.log(curso);
    console.log(JSON.parse(JSON.stringify(curso)));

    // Guardar el curso en Firestore
    console.log("Creando curso en Firestore...");
    await setDoc(
      doc(collection(db, `courses`)),
      JSON.parse(JSON.stringify(curso))
    );
    alert("Curso creado con éxito");
  } catch (error) {
    console.error("Error al crear el curso:", error);
    alert("Hubo un error al crear el curso, inténtalo de nuevo.");
  }
};

export const getCourse = (id) => getDoc(doc(db, `task`, id));

export const deleteCourse = (id) => deleteDoc(doc(db, `task`, id));

export const updateCourse = (id, newFields) =>
  updateDoc(doc(db, `task`, id), newFields);

export const onGetCourses = (callback) =>
  onSnapshot(collection(db, `courses`), callback);
