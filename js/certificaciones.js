import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc, updateDoc, onSnapshot, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { showToast } from "../js/showToast.js "

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

    const signinModal = document.querySelector('#addCertificationModal')
    const modal = bootstrap.Modal.getInstance(signinModal)
    modal.hide()

    showToast("Curso creado exitosamente")
}
// para editar ocupo el id
let idMarcador

//cargar las certificaciones guardadas
document.addEventListener("DOMContentLoaded", async () => {
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
            <div class="card efecto">
  
  <div class="card-body">
  <img src="/assets/img/certi.png" width="20px" height="175px" class="card-img" alt="...">
    <h5 class="card-title">${certification.title}</h5>
    <p class="card-text">Para el curso: ${certification.curso}</p>
    <p class="card-text">${certification.description}</p>
    <p class="card-text bold"> $${certification.precio} </p>
    <div class="btn-container mt-auto d-flex justify-content-end">
    <button title="Eliminar" class="btn btn-danger btn-delete" style="color: white;" data-id="${cert}"><i class="fa-solid fa-trash"></i></button>
    <button title="Editar" class="btn btn-primary btn-edit" style="color: white;" data-id="${cert}"><i class="fa-regular fa-pen-to-square"></i></button>
    </div>
    
  </div>
</div> `
            row.appendChild(col)
        })
        div.appendChild(row)
        cargarCursos()
        const btnsDelete = div.querySelectorAll(".btn-delete");
        btnsDelete.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.currentTarget.getAttribute("data-id")
                deleteDoc(doc(db, "certifications", id));
                showToast(`Curso eliminado`, "error")

            })
        })
        const btnsEdit = div.querySelectorAll(".btn-edit");
        btnsEdit.forEach(btn => {
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
                    document.getElementById("tituloModal").textContent = "Editar certificación"
                    idMarcador = id;

                    const signinModal = document.querySelector('#addCertificationModal')
                    const modal = new bootstrap.Modal(signinModal)
                    modal.show()

                    //reiniciar el id si se cancela el editar
                    signinModal.addEventListener('hidden.bs.modal', () => {
                        certificacionForm.reset()
                        document.getElementById("bnt-add-certificacion").textContent = "Agregar"
                        document.getElementById("tituloModal").textContent = "Registrar nueva certificación"
                        idMarcador = null
                    })
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

        const signinModal = document.querySelector('#addCertificationModal')
        const modal = bootstrap.Modal.getInstance(signinModal)
        modal.hide()

        showToast("Curso editado correctamente")
        document.getElementById("bnt-add-certificacion").textContent = "Agregar"
    } catch (error) {
        showToast("Error al editar el curso", "error")
    }
}
async function cargarCursos() {
    const collectionCourses = collection(db, "courses")
    const selectCourses = document.getElementById("curso-certificacion")
    selectCourses.innerHTML = ""
    onSnapshot(collectionCourses, (sn) => {
        const optionCourses1 = document.createElement("option")
        optionCourses1.value = "";
        optionCourses1.textContent = "-- Elige un curso --";
        selectCourses.appendChild(optionCourses1)
        sn.forEach((doc) => {
            const courses = doc.data()
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

