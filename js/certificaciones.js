import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc, updateDoc, onSnapshot, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


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
// para editar ocupo el id
let idMarcador

//cargar las certificaciones guardadas
document.addEventListener("DOMContentLoaded", async () => {
    console.log("entro")
    const div = document.getElementById("courses")
    const collectionCertification = collection(db, "certifications")

    onSnapshot(collectionCertification, (sn) => {
        div.innerHTML = ``
        const row = document.createElement("div");
        row.className = "row g-3";
        sn.forEach((doc) => {
            const certification = doc.data()
            const cert = doc.id;
            const col = document.createElement("div")
            col.className = "col-12 col-md-6 col-lg-4"
            col.innerHTML = `
            <div class="card">
  <img src="/assets/img/certi.png"  class="card-img-top" alt="...">
  <div class="card-body ">
    <h5 class="card-title">${certification.title}</h5>
    <p class="card-text">Para el curso: ${certification.curso}</p>
    <p class="card-text">${certification.description}</p>
    <p class="card-text bold"> $${certification.precio} </p>
    <button class="btn btn-primary btn-delete" data-id="${cert}"><i class="fa-solid fa-trash"></i></button>
    <button class="btn btn-primary btn-edit" data-id="${cert}"><i class="fa-regular fa-pen-to-square"></i></button>
  </div>
</div> `
            console.log(cert)
            row.appendChild(col)
        })
        div.appendChild(row)
        cargarCursos()
        const btnsDelete = div.querySelectorAll(".btn-delete");
        btnsDelete.forEach(btn => {
            console.log("entro btns")
            btn.addEventListener("click", (e) => {
                const id = e.currentTarget.getAttribute("data-id")
                deleteDoc(doc(db, "certifications", id));
                console.log("se elimino correctamente")
            })
        })
        const btnsEdit = div.querySelectorAll(".btn-edit");
        btnsEdit.forEach(btn => {
            console.log("edit btns")
            btn.addEventListener("click", async (e) => {
                const id = (e.currentTarget.getAttribute("data-id"))
                console.log(id)
                const docSnap = await getDoc(doc(db, "certifications", id));
                if (docSnap.exists()) {
                    const task = docSnap.data()
                    const certificacionForm = document.getElementById("form-registrar-curso")
                    certificacionForm["titulo-certificacion"].value = task.title
                    certificacionForm["precio-certificacion"].value = task.precio
                    certificacionForm["curso-certificacion"].value = task.curso
                    certificacionForm["des-certificacion"].value = task.description
                    document.getElementById("bnt-add-certificacion").textContent = "Editar"
                    idMarcador = id;
                } else {
                    console.log("No such document!");
                }
            })
        })
    })
});

async function editarCertificacion(data) {
    try {
        // Referencia al documento con el ID dado

        // Actualiza los campos que desees en el documento
        await updateDoc(doc(db, "certifications", idMarcador), {
            title: data.title,
            precio: data.precio,
            curso: data.curso,
            description: data.description
        });

        console.log("Documento actualizado exitosamente");
        document.getElementById("bnt-add-certificacion").textContent = "Agregar"
    } catch (error) {
        console.error("Error al actualizar el documento: ", error);
    }
}
async function cargarCursos() {
    const collectionCourses = collection(db, "courses")
    const selectCourses = document.getElementById("curso-certificacion")

    onSnapshot(collectionCourses, (sn) => {
        const optionCourses1 = document.createElement("option")
            optionCourses1.value = "";
            optionCourses1.textContent = "-- Elige un curso --";
            selectCourses.appendChild(optionCourses1)
        sn.forEach((doc) => {
            const courses = doc.data()
            console.log(courses.title)
            const optionCourses = document.createElement("option")
            optionCourses.value = courses.title;
            optionCourses.textContent = courses.title;
            selectCourses.appendChild(optionCourses)
        })
    })
}

certificacionForm.addEventListener("submit", async (e) => {

    e.preventDefault()
    const title = certificacionForm["titulo-certificacion"]
    const precio = certificacionForm["precio-certificacion"]
    const curso = certificacionForm["curso-certificacion"]
    const description = certificacionForm["des-certificacion"]
    if (document.getElementById("bnt-add-certificacion").textContent == "Editar") {
        const data = {
            title: title.value,
            precio: precio.value,
            curso: curso.value,
            description: description.value
        }
        editarCertificacion(data)


    } else {

        await saveCertification(title.value, precio.value, curso.value, description.value)
    }
    title.value = ""
    precio.value = ""
    curso.value = ""
    description.value = ""

})

