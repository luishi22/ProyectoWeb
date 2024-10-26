import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc, updateDoc, onSnapshot, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
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
const saveCompra = async (certificationId, userId) => {
    const compraRef = doc(collection(db, "buyCertification"))
    await setDoc(compraRef, {
        certificationId,
        userId
    })
}
document.addEventListener("DOMContentLoaded", async () => {
    const div = document.getElementById("courses")
    const collectionCertification = collection(db, "certifications")
    const collectionCompras = collection(db, "buyCertification")
    //recuperarID en la coleccion compras
    const comprasSnapshot = await getDocs(collectionCompras);
    const currentUserId = localStorage.getItem('userId')
    console.log(comprasSnapshot.docs)
    const comprasIds = comprasSnapshot.docs
        .filter(doc => doc.data().userId === currentUserId) // Filtrar por userID
        .map(doc => doc.data().certificationId); // Obtener los certificationId
    console.log(comprasIds);
    console.log(comprasIds)
    onSnapshot(collectionCertification, (sn) => {
        div.innerHTML = ``
        const row = document.createElement("div");
        row.className = "row g-3";
        sn.forEach((doc) => {
            const certification = doc.data()
            const cert = doc.id;
            const col = document.createElement("div")
            col.className = "col-12 col-md-6 col-lg-4"
            //verifivar si el array creado de comprasIDS incluye alguno de estos
            const userId = localStorage.getItem('userId');
            console.log(userId)
            let buttonLabel
            let targetModal
            if (userId !== null) {
                buttonLabel = comprasIds.includes(cert) ? "Realizar Test" : "Obtener Cert.";
                targetModal = comprasIds.includes(cert) ? "#modalTest" : "#modalPago";
            } else {
                buttonLabel = comprasIds.includes(cert) ? "Realizar Test" : "Obtener Cert.";
                targetModal = "#modalinv"
            }


            col.innerHTML = `
            <div class="card">
            
                <div class="card-body">
                <img src="/assets/img/certi.png" alt="Icono del curso" class="card-img">
                    <div class="p-1">
                        <h5 class="card-title">${certification.title}</h5>
                        <p class="card-text">Para el curso: ${certification.curso}</p>
                        <p class="card-text"> $${certification.precio}</p>
                    </div>
                    <button title="Obtener Certificación" class="btn btn-success btn-comprar" data-bs-toggle="modal" data-bs-target="${targetModal}" data-id="${cert}" id="${cert}">
                        <i class="fa-regular fa-credit-card"></i> ${buttonLabel}
                    </button>
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
                console.log(localStorage.getItem('userId'))
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
                    const userID = localStorage.getItem('userId')
                    saveCompra(id, userID)
                    showToast("Compra realizada con éxito")
                    const btnChange = document.getElementById(id)
                    console.log(btnChange.textContent)
                    btnChange.textContent = "Realizar Test"
                    btnChange.setAttribute('data-bs-target', '#modalTest');
                    console.log(localStorage.getItem('userId'))
                    formPasarelaPago.reset()
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

