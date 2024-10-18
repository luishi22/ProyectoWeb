import { auth } from './firebase.js';
import { updateProfile } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
import { showToast } from './showToast.js';

const db = getFirestore();
const storage = getStorage();

auth.onAuthStateChanged(async (user) => {
    if (user) {

        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById('nombre-usuario').value = user.displayName || userData.displayName || '';
            document.getElementById('correo-usuario').value = user.email;
            document.getElementById('rol-usuario').value = userData.role || '';

            if (userData['profile-photo']) {
                document.getElementById('imagen-perfil').src = userData['profile-photo'];
            }
        }
    }
});


document.getElementById('form-profile').addEventListener('submit', async (event) => {
    event.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    const displayName = document.getElementById('nombre-usuario').value;
    const fotoInput = document.getElementById('foto-usuario');

    try {
        await updateProfile(user, { displayName: displayName });

        let profilePhotoURL = null;

        if (fotoInput.files[0]) {
            const file = fotoInput.files[0];
            const storageRef = ref(storage, `profile-photos/${user.uid}`);

            const snapshot = await uploadBytes(storageRef, file);
            profilePhotoURL = await getDownloadURL(snapshot.ref);
        }

        const userRef = doc(db, "users", user.uid);
        const updateData = { displayName: displayName };

        if (profilePhotoURL) { updateData['profile-photo'] = profilePhotoURL; }

        await updateDoc(userRef, updateData);

        showToast('Perfil actualizado correctamente');
    } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        showToast('Error al actualizar el perfil', 'Error');
    }
});


document.getElementById('foto-usuario').addEventListener('change', function (event) {
    const input = event.target
    const reader = new FileReader()

    if (input.files && input.files[0]) {
        reader.onload = function (e) {
            document.getElementById('imagen-perfil').src = e.target.result
        };
        reader.readAsDataURL(input.files[0])
    }
});








