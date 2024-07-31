// Import the necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

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
const database = getDatabase(app);
const auth = getAuth();

// Reference to the reports data in Firebase
const reportsRef = ref(database, 'reports');

// Get data from Firebase and populate the table
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userRef = ref(database, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            const userRole = userData.role;

            if (userRole === 'admin') {
                // Fetch all reports for admin
                onValue(reportsRef, (snapshot) => {
                    const data = snapshot.val();
                    populateTable(data);
                });
            } else {
                // Fetch only user-specific reports
                const userReportsRef = ref(database, 'reports/' + user.uid);
                onValue(userReportsRef, (snapshot) => {
                    const data = snapshot.val();
                    populateTable(data);
                });
            }
        });
    } else {
        alert('Silakan login terlebih dahulu.');
        window.location.href = '/login&register/login.html';
    }
});

function populateTable(data) {
    const tableBody = document.querySelector('#data-table tbody');
    tableBody.innerHTML = ''; // Clear existing table data

    if (data) {
        Object.keys(data).forEach(key => {
            const report = data[key];
            const row = document.createElement('tr');
            
            // Create table cells
            const dateCell = `<td>${report.date}</td>`;
            const locationCell = `<td>${report.location}</td>`;
            const typeCell = `<td>${report.type}</td>`;
            const descriptionCell = `<td>${report.description}</td>`;

            // Create image cell
            const imageCell = report.imageUrl 
                ? `<td><img src="${report.imageUrl}" alt="Report Image"></td>` 
                : '<td>No Image</td>';
            
            // Create video cell
            const videoCell = report.videoUrl 
                ? `<td><video src="${report.videoUrl}" controls></video></td>` 
                : '<td>No Video</td>';
            
            // Combine cells into a row
            row.innerHTML = `${dateCell}${locationCell}${typeCell}${descriptionCell}${imageCell}${videoCell}`;
            
            // Append the row to the table body
            tableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6">No reports available</td>';
        tableBody.appendChild(row);
    }
}
