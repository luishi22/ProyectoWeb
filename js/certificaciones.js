import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs, onSnapshot, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// traer la base de datos
const db = getFirestore(app);
// llamados a objetos de html
const certificacionForm = document.getElementById("form-registrar-curso")
// funciones directas de firebase
// llama a las funciones de firebase para guardar ladata en la bd no sql
const saveCertification = async (title, precio, curso, description) => {
    const certificationRef = doc(collection(db, "certifications"))
    await setDoc(certificationRef, {
        title,
        precio,
        curso,
        description,
    })
}
// trae los datos de la bd nosql

//cargar las certificaciones guardadas
document.addEventListener("DOMContentLoaded", async () => {
    console.log("entro")
    const div = document.getElementById("courses")
    const collectionCertification = collection(db, "certifications")

    onSnapshot(collectionCertification, (sn) => {
        div.innerHTML = ``
        const row = document.createElement("div");
        row.className = "row";
        sn.forEach((doc) => {
            const certification = doc.data()
            const cert = doc.id;
            const col = document.createElement("div")
            col.className = "col-md-3"
            col.innerHTML = `
            <div class="card mb-4" ">
  <img src="/assets/img/certificate.png"  class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${certification.title}</h5>
    <p class="card-text">Para el curso: ${certification.curso}</p>
    <p class="card-text">${certification.description}</p>
    <p class="card-text bold"> $${certification.precio} </p>
    <button class="btn btn-primary btn-delete" data-id="${cert}"><i class="fa-solid fa-trash"></i></button>
    <button class="btn btn-primary btn-edit" data-id="${cert} "><i class="fa-regular fa-pen-to-square"></i></button>
  </div>
</div> `
            console.log(cert)
            row.appendChild(col)
        })
        div.appendChild(row)
        const btnsDelete = div.querySelectorAll(".btn-delete");
        btnsDelete.forEach(btn => {
            console.log("entro btns")
            btn.addEventListener("click", (e) => {
                console.log(e.currentTarget.getAttribute("data-id"))
            })
        })
    })
});



certificacionForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const title = certificacionForm["titulo-certificacion"]
    const precio = certificacionForm["precio-certificacion"]
    const curso = certificacionForm["curso-certificacion"]
    const description = certificacionForm["des-certificacion"]
    await saveCertification(title.value, precio.value, curso.value, description.value)

})

