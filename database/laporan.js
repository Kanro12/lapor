// Import the necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js";
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
const storage = getStorage(app);
const auth = getAuth();

// Handle form submission
document.querySelector('#report-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get user input
    const date = document.querySelector('#date').value;
    const location = document.querySelector('#location').value;
    const type = document.querySelector('#type').value;
    const description = document.querySelector('#description').value;
    const imageFile = document.querySelector('#image').files[0];
    const videoFile = document.querySelector('#video').files[0];

    // Check if the user is authenticated
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                // Upload image and video files to Firebase Storage
                const imageUrl = imageFile ? await uploadFile(imageFile, 'images/') : null;
                const videoUrl = videoFile ? await uploadFile(videoFile, 'videos/') : null;

                // Write the report data to Firebase Realtime Database under the authenticated user
                const reportRef = ref(database, 'reports/' + user.uid);
                await push(reportRef, {
                    date: date,
                    location: location,
                    type: type,
                    description: description,
                    imageUrl: imageUrl,
                    videoUrl: videoUrl
                });

                // Notify user and reset form
                alert('Laporan berhasil dikirim!');
                document.querySelector('#report-form').reset();
            } catch (error) {
                // Error occurred
                console.error('Error submitting report:', error.message);
                alert('Terjadi kesalahan: ' + error.message);
            }
        } else {
            console.log('No user is authenticated');
            alert('Silakan login terlebih dahulu.');
        }
    });
});

// Helper function to upload files
async function uploadFile(file, folder) {
    const fileName = sanitizeFileName(file.name);
    const fileRef = storageRef(storage, `${folder}${fileName}`);
    try {
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    } catch (error) {
        console.error('Error uploading file:', error.message);
        throw error;
    }
}

// Helper function to sanitize file names
function sanitizeFileName(fileName) {
    return fileName.replace(/[^a-zA-Z0-9.-_]/g, '_');
}
