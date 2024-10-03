// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);