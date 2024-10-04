import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"
import { auth } from "./firebase.js"
import { loginCheck } from './loginCheck.js';
import './signupForm.js'
import './signinForm.js'
import './googleLogin.js'
import './facebookLogin.js'
import './logout.js'

onAuthStateChanged(auth, async (user) => {
    loginCheck(user);
    
    /* if(user){
        loginCheck(user);
    }else{
        loginCheck(user);
    } */
})