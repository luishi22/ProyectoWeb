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
const saveCompra = async (title, precio, curso, description) => {
    const certificationRef = doc(collection(db, "certifications"))
    await setDoc(certificationRef, {
        title,
        precio,
        curso,
        description,
    })
    showToast("Curso creado exitosamente")
}
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
            <div class="card">
  <img src="/assets/img/certi.png"  class="card-img-top" alt="...">
  <div class="card-body ">
    <h5 class="card-title">${certification.title}</h5>
    <p class="card-text">Para el curso: ${certification.curso}</p>
    <p class="card-text">${certification.description}</p>
    <p class="card-text bold"> $${certification.precio} </p>
    <button class="btn btn-outline-success btn-comprar" data-bs-toggle="modal" data-bs-target="#modalPago" data-id="${cert}" id="${cert}">Obtener curso</button>
  </div>
</div> `
            row.appendChild(col)
        })
        div.appendChild(row)
        const btnsDelete = div.querySelectorAll(".btn-comprar");
        btnsDelete.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.currentTarget.getAttribute("data-id")
                console.log(id)
                SimularPago(id)
            })
        })
    })
});
function SimularPago(id) {
    const btnComprar = document.getElementById("modalComprar")
    btnComprar.addEventListener("click", function (e) {
        e.preventDefault()
        const formPasarelaPago = document.getElementById("form-pasarela-pago")
        const email = formPasarelaPago["email-pago"].value
        const dueño = formPasarelaPago["nombreTarjeta-pago"].value
        const numTar = formPasarelaPago["numero-pago"].value
        const mes = formPasarelaPago["mes-pago"].value
        const anho = formPasarelaPago["año-pago"].value
        const cvv = formPasarelaPago["cvv-pago"].value
        if (email !== "" && dueño !== "" && numTar !== "" && mes !== "" && anho !== "") {
            if (cvv.length == 3) {
                if (numTar.length == 19) {
                    showToast("Compra realizada con éxito")
                    const btnChange = document.getElementById(id)
                    console.log(btnChange.textContent)
                    btnChange.textContent = "Realizar Test"
                    btnChange.setAttribute('data-bs-target', '#modalTest');
                } else {
                    showToast("Número de tarjeta, es incorrecto", "error")
                }
            } else {
                showToast("CVV, es incorrecto", "error")
            }
        } else {
            showToast("Ingrese todos los datos", "error")
        }

    })

}

