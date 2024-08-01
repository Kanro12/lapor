// Fungsi untuk menampilkan data kantor polisi di halaman
async function fetchPoliceStations() {
    try {
        // Mengambil data dari file JSON
        const response = await fetch('/json/data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const stations = data.polsek;

        // Mendapatkan elemen di halaman untuk menampilkan data
        const list = document.getElementById('police-stations');
        if (!list) {
            throw new Error('Element with id "police-stations" not found');
        }

        // Mengiterasi data dan membuat elemen list
        stations.forEach(station => {
            const listItem = document.createElement('li');
            listItem.classList.add('station-item');

            listItem.innerHTML = `
                <div class="station-image">
                    <img src="${station.gambar}" alt="${station.nama}" />
                </div>
                <div class="station-info">
                    <h2>${station.nama}</h2>
                    <p><strong>Alamat:</strong> ${station.alamat}</p>
                    <p><strong>Telepon:</strong> ${station.telepon}</p>
                    ${station.wa ? `<p><strong>WhatsApp:</strong> ${station.wa}</p>` : ''}
                    <p><strong>Website:</strong> <a href="${station.website}" target="_blank">${station.website}</a></p>
                    ${station.sosmed ? `<p><strong>Sosial Media:</strong> <a href="${station.sosmed}" target="_blank">${station.sosmed}</a></p>` : ''}
                </div>
            `;

            list.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Memanggil fungsi ketika halaman dimuat
document.addEventListener('DOMContentLoaded', fetchPoliceStations);
