import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


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

//login
const btnLogin = document.getElementById('btnLogin');
btnLogin.addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById('lEmail').value;
    const password = document.getElementById('lPassword').value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        showMessage('Inicio de sesion con exito !', 'loginMessage');
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = 'homepage.html';
    })
    .catch((error)=>{
        const errorCode = error.code;
        if (errorCode === 'auth/wrong-password') {
            showMessage('Contraseña incorrecta', 'loginMessage');
        } else if (errorCode === 'auth/user-not-found') {
            showMessage('Cuenta no existe', 'loginMessage');
        } else if (errorCode === 'auth/invalid-email') {
            showMessage('Correo electrónico no válido', 'loginMessage');
        } else {
            showMessage('Error: ' + error.message, 'loginMessage');
        }
    });
});