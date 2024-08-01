// Import the necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";
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

// Function to populate police stations dropdown
async function populatePoliceStations() {
    const policeStationsRef = ref(database, 'police-stations/');
    try {
        const snapshot = await get(policeStationsRef);
        const policeStations = snapshot.val();
        const policeStationSelect = document.querySelector('#police-station');

        if (policeStations) {
            // Clear existing options
            policeStationSelect.innerHTML = '<option value="">Pilih Kantor Polisi</option>';

            // Populate dropdown
            Object.keys(policeStations).forEach(key => {
                const station = policeStations[key];
                const option = document.createElement('option');
                option.value = key; // Use key as the value to store in the form
                option.textContent = station.name; // Display station name
                policeStationSelect.appendChild(option);
            });
        } else {
            console.error('No police stations found.');
        }
    } catch (error) {
        console.error('Error fetching police stations:', error.message);
    }
}

// Call populatePoliceStations on page load
document.addEventListener('DOMContentLoaded', populatePoliceStations);

// Handle form submission
document.querySelector('#report-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get user input
    const username = document.querySelector('#username').value;
    const nik = document.querySelector('#nik').value;
    const telepon = document.querySelector('#Telepon').value;
    const date = document.querySelector('#date').value;
    const location = document.querySelector('#location').value;
    const type = document.querySelector('#type').value;
    const description = document.querySelector('#description').value;
    const age = document.querySelector('#age').value;
    const policeStationKey = document.querySelector('#police-station').value;
    const imageFile = document.querySelector('#image').files[0];
    const videoFile = document.querySelector('#video').files[0];

    // Determine age category
    const ageCategory = determineAgeCategory(age);

    // Check if the user is authenticated
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                // Retrieve the police station name from the key
                const policeStationsRef = ref(database, 'police-stations/' + policeStationKey);
                const stationSnapshot = await get(policeStationsRef);
                const policeStation = stationSnapshot.val();
                const policeStationName = policeStation ? policeStation.name : 'Unknown';

                // Upload image and video files to Firebase Storage
                const imageUrl = imageFile ? await uploadFile(imageFile, 'images/') : null;
                const videoUrl = videoFile ? await uploadFile(videoFile, 'videos/') : null;

                // Write the report data to Firebase Realtime Database under the authenticated user
                const reportRef = ref(database, 'reports/' + user.uid);
                await push(reportRef, {
                    username: username,
                    nik: nik,
                    telepon: telepon,
                    date: date,
                    location: location,
                    type: type,
                    description: description,
                    age: age,
                    ageCategory: ageCategory,
                    policeStation: policeStationName,
                    imageUrl: imageUrl,
                    videoUrl: videoUrl
                });

                // Notify user and reset form
                alert('Laporan berhasil dikirim!');
                document.querySelector('#report-form').reset();

                // Redirect to history page
                window.location.href = '/user/history.html';
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

// Function to determine age category
function determineAgeCategory(age) {
    if (age < 5) {
        return 'Bayi dan Balita';
    } else if (age >= 5 && age <= 9) {
        return 'Anak-anak';
    } else if (age >= 10 && age <= 18) {
        return 'Remaja';
    } else if (age >= 19 && age <= 59) {
        return 'Dewasa';
    } else if (age >= 60) {
        return 'Lansia';
    } else {
        return 'Tidak Diketahui';
    }
}

// Function to update age category display
function updateAgeCategory() {
    const ageInput = document.querySelector('#age');
    const ageCategoryDisplay = document.querySelector('#age-category');
    const age = ageInput.value;
    const ageCategory = determineAgeCategory(age);
    ageCategoryDisplay.textContent = `Kategori Usia: ${ageCategory}`;
}

// Attach event listener to age input to update category on input
document.querySelector('#age').addEventListener('input', updateAgeCategory);

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
