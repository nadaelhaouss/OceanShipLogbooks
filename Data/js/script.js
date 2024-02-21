
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'});

var darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CartoDB</a>'
    });

    function showAboutModal() {
        $('#aboutModal').modal('show');
    }
    
    $(document).ready(function(){
        $('#aboutTabs a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
    
        $('#aboutModal').on('shown.bs.modal', function () {
            $('#aboutTabs a:first').tab('show');
        });
    });
    



var baseMaps = {
    "OpenStreetMap": osm,
    "OpenStreetMap.HOT": osmHOT,
    "DarkLayer": darkLayer
};





var point = L.geoJSON(point);


var clusterLayer = L.markerClusterGroup();
clusterLayer.addLayer(point);


function createroutesPopup(feature, layer) {

    var voyageIni = feature.properties.VoyageIni;
    var shipName = feature.properties.ShipName;


    var popupContent = "<b>Ship Name:</b> " + shipName + "<br>" +
                       "<b>Voyage Initiation:</b> " + voyageIni;


    layer.bindPopup(popupContent);
}

var map = L.map('map', {
    center: [45.9965957, 2.6890623],
    zoom: 6,
    layers: [darkLayer]
});


function createRoutesPopup(feature, layer) {
    var voyageIni = feature.properties.VoyageIni;
    var shipName = feature.properties.ShipName;

    var popupContent = "<b>Ship Name:</b> " + shipName + "<br>" +
                       "<b>Voyage Initiation:</b> " + voyageIni;

    layer.bindPopup(popupContent);
}


var routesGeoJSON = L.geoJSON(routes, {
    onEachFeature: createRoutesPopup
});


var shipSelect = document.getElementById('shipSelect');
routes.features.forEach(function(feature) {
    var shipName = feature.properties.ShipName;
    if (!shipSelect.querySelector('option[value="' + shipName + '"]')) {
        var option = document.createElement('option');
        option.value = shipName;
        option.text = shipName;
        shipSelect.appendChild(option);
    }
});


shipSelect.addEventListener('change', function(e) {
    var selectedShipName = e.target.value;
    routesGeoJSON.eachLayer(function(layer) {
        if (layer.feature.properties.ShipName === selectedShipName) {
            layer.addTo(map);
        } else {
            map.removeLayer(layer);
        }
    });
});


function showFilterModal() {
    $('#FilterModal').modal('show');
}





var southWest = L.latLng(-90, -179),
northEast = L.latLng(90, 179),
worldBounds = L.latLngBounds(southWest, northEast);

var OverlayMaps = {
    "Points": clusterLayer,
    "Routes": routesGeoJSON
};

clusterLayer.addTo(map);

L.esri.Geocoding.geosearch().addTo(map);

L.control.layers(baseMaps, OverlayMaps).addTo(map);
L.control.scale().addTo(map);

