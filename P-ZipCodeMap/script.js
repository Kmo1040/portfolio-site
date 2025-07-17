document.addEventListener('DOMContentLoaded', () => {

    var map = L.map('map').setView([38.6270, -90.3994], 11);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> contributors',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    let highlightedZips = ['63017', '63141', '63122'];
    let zipLayer;
    let geoData;

    function renderZipLayer(data) {
        if (zipLayer) {
             map.removeLayer(zipLayer);
        }

        zipLayer = L.geoJSON(data, {
            style: function(feature) {
                if (highlightedZips.includes(feature.properties.ZCTA5CE10)) {
                    return { color: '#ff4d6d', weight: 3, fillOpacity: 0.6 };
                } else {
                    return { color: '#444444', weight: 0.5, fillOpacity: 0 };
                }
            },
            onEachFeature: function(feature, layer) {
                layer.bindTooltip("ZIP Code: " + feature.properties.ZCTA5CE10, {
                    sticky: true,
                    direction: "top",
                    className: "zip-tooltip"
                });                
            }
        }).addTo(map);
    }

    function updateZipList() {
        const list = document.getElementById('zip-list');
        const maxNotice = document.getElementById('zip-max-notice');

        list.innerHTML = '';
        highlightedZips.forEach(zip => {
            const li = document.createElement('li');
            li.textContent = zip;
            list.appendChild(li);
        });

        if (highlightedZips.length >= 12) {
            maxNotice.style.display = 'block';
        } else {
            maxNotice.style.display = 'none';
        }
    }

    fetch('/P-ZipCodeMap/data/missouri_zips.geojson')
        .then(response => response.json())
        .then(data => {
            geoData = data;
            renderZipLayer(geoData);
            updateZipList();
        })
        .catch(err => console.error("GeoJSON load error:", err));

    document.getElementById('add-zip').addEventListener('click', () => {
        const input = document.getElementById('zip-input').value.trim();
        if (input && !highlightedZips.includes(input) && highlightedZips.length < 12) {
            highlightedZips.push(input);
            renderZipLayer(geoData);
            updateZipList();
        }
        document.getElementById('zip-input').value = '';
    });

    document.getElementById('remove-zip').addEventListener('click', () => {
        const input = document.getElementById('zip-input').value.trim();
        highlightedZips = highlightedZips.filter(zip => zip !== input);
        renderZipLayer(geoData);
        updateZipList();
        document.getElementById('zip-input').value = '';
    });
});