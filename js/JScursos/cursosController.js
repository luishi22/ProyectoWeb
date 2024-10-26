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
  } catch (error) {
    alert("Hubo un error al crear el curso, inténtalo de nuevo.");
  }
};

export const getCourse = (id) => getDoc(doc(db, `task`, id));

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
  } catch (error) {
    alert("Hubo un error al actualizado el curso, inténtalo de nuevo.");
  }
};

export const onGetCourses = (callback) =>
  onSnapshot(collection(db, `courses`), callback);
