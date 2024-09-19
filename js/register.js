import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDzIK9G9v1NalhLyQZW83z2IG3Qi8vDuxs",
    authDomain: "appcursos-4f990.firebaseapp.com",
    databaseURL: "https://appcursos-4f990-default-rtdb.firebaseio.com",
    projectId: "appcursos-4f990",
    storageBucket: "appcursos-4f990.appspot.com",
    messagingSenderId: "105350704501",
    appId: "1:105350704501:web:42aa697e8ae87cb9e7773c",
    measurementId: "G-47T2BW6XX2"};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// alert
function showMessage(message, divId){
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function(){
        messageDiv.style.opacity = 0;
    }, 5000);
}

// registro
const btnRegister = document.getElementById('btnRegister');
btnRegister.addEventListener('click', function (event) {
    event.preventDefault();

    const email = document.getElementById('uEmail').value;
    const password = document.getElementById('uPassword').value;
    const firstName = document.getElementById('uFirstname').value;
    const lastName = document.getElementById('uLastname').value;

    const  auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password, firstName, lastName)
    .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
            email: email,
            firstName: firstName,
            lastName: lastName
        };
        showMessage('Cuenta creada con exito !', 'registerMessage');
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(()=> {
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error("error al escribir e documento", error);
        });
    })
    .catch((error)=>{
        const errorCode = error.code;
        if(errorCode == 'auth/email-already-in-use'){
            showMessage('El correo ingresado ya ha sido registrado !!!', 'registerMessage');
        }
        else{
            showMessage('incapaz de crear el usuario', 'registerMessage');
        }
    });
});