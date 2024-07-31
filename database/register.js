// Import the necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyADwagZsQxhQBQpwvubO9ulz7QHruJyVkM",
    authDomain: "lapor-cde21.firebaseapp.com",
    projectId: "lapor-cde21",
    storageBucket: "lapor-cde21.appspot.com",
    messagingSenderId: "89266309551",
    appId: "1:89266309551:web:b9f1dc04ac75721922c75a",
    measurementId: "G-4NRHYVEE7Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Handle user registration
document.querySelector('#registerButton').addEventListener('click', async (e) => {
    e.preventDefault();

    // Get user input
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;
    const userRole = document.querySelector('#userRole').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Kata sandi tidak cocok!');
        return;
    }

    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Successfully registered
        console.log('User registered:', user);
        alert('Pendaftaran berhasil!');

        // Save user information to Realtime Database
        await set(ref(database, 'users/' + user.uid), {
            name: name,
            email: email,
            role: userRole
        });

        // Redirect to login or another page
        window.location.href = '/login&register/login.html';
    } catch (error) {
        // Error occurred
        console.error('Error registering:', error.message);
        alert('Terjadi kesalahan: ' + error.message);
    }
});
