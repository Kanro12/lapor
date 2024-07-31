// Import fungsi yang diperlukan dari SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

// Konfigurasi Firebase untuk aplikasi web Anda
const firebaseConfig = {
    apiKey: "AIzaSyADwagZsQxhQBQpwvubO9ulz7QHruJyVkM",
    authDomain: "lapor-cde21.firebaseapp.com",
    projectId: "lapor-cde21",
    storageBucket: "lapor-cde21.appspot.com",
    messagingSenderId: "89266309551",
    appId: "1:89266309551:web:b9f1dc04ac75721922c75a",
    measurementId: "G-4NRHYVEE7Y"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Menangani proses login
document.querySelector('.button').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('Pengguna berhasil masuk:', user);

        // Ambil peran pengguna dari Realtime Database
        const userRef = ref(database, 'users/' + user.uid);
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            const userRole = userData.role;

            // Arahkan berdasarkan peran
            if (userRole === 'admin') {
                window.location.href = '/admin/index.html';
            } else if (userRole === 'user') {
                window.location.href = '/user/index.html';
            } else {
                console.error('Peran pengguna tidak dikenal:', userRole);
                alert('Peran pengguna tidak dikenal. Silakan hubungi dukungan.');
            }
        } else {
            console.error('Dokumen pengguna tidak ditemukan!');
            alert('Pengguna tidak ditemukan. Silakan hubungi dukungan.');
        }
    } catch (error) {
        console.error('Kesalahan saat masuk:', error.message);
        alert('Kesalahan saat masuk: ' + error.message);
    }
});
