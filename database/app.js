// Import the necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

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

// Function to fetch and display police station data
async function fetchAndDisplayPoliceStations() {
    try {
        // Reference to police stations in Realtime Database
        const policeStationsRef = ref(database, 'police-stations');
        const snapshot = await get(policeStationsRef);

        if (snapshot.exists()) {
            const policeStations = snapshot.val();

            // Iterate over the police stations and display them
            for (const [key, station] of Object.entries(policeStations)) {
                const stationElement = document.querySelector(`.police-station[data-station-name="${station.name}"]`);
                if (stationElement) {
                    // Update police station details
                    const imgElement = stationElement.querySelector('.police-image img');
                    if (imgElement) {
                        imgElement.src = station.imageURL; // Set the image URL
                    }
                    const detailsElement = stationElement.querySelector('.police-details');
                    if (detailsElement) {
                        detailsElement.querySelector('p:nth-of-type(1)').textContent = station.address;
                        detailsElement.querySelector('p:nth-of-type(2)').textContent = station.hours;
                        detailsElement.querySelector('p:nth-of-type(3)').textContent = station.phone || 'No phone number available';
                    }
                }
            }
        } else {
            console.log('No police station data found.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call the function to fetch and display data when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayPoliceStations);
