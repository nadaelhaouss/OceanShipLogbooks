
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
    

function windDirectionToDegrees(direction) {
    direction = direction.toUpperCase();
    switch (direction) {
        case "N":
            return 0;
        case "NNO":
            return 22.5;
        case "NO":
            return 45;
        case "ONO":
            return 67.5;
        case "O":
            return 90;
        case "OSO":
            return 112.5;
        case "SO":
            return 135;
        case "SSO":
            return 157.5;
        case "S":
            return 180;
        case "SSW":
            return 202.5;
        case "SW":
            return 225;
        case "WSW":
            return 247.5;
        case "W":
            return 270;
        case "WNW":
            return 292.5;
        case "NW":
            return 315;
        case "NNW":
            return 337.5;
        case "O1/4N":
            return 22.5; 
        case "N1/4N":
            return 11.25; 

        case "O1/4SO":
            return 112.5; 
        case "SO1/4O":
            return 112.5; 
        case "SE1/4S":
            return 157.5;
        default:

            const numericValue = parseFloat(direction);
            if (!isNaN(numericValue)) {
                return numericValue;
            }

            return 0;
    }
}



var ShipIcon = L.icon({
        iconUrl: 'Data/js/navire.png',
    
        iconSize:     [38, 38], 
        iconAnchor:   [0, 0], 
        popupAnchor:  [0, -40] 
    });

var baseMaps = {
    "OpenStreetMap": osm,
    "OpenStreetMap.HOT": osmHOT,
    "DarkLayer": darkLayer
};

function createPointPopup(feature, layer) {
    var YY = feature.properties.Year;
    var MM = feature.properties.Month;
    var DD = feature.properties.Day;
    var popupContent = DD + " / " + MM + " / " + YY + "&nbsp;&nbsp;&nbsp;&nbsp;"; 

    layer.bindPopup(popupContent);

    layer.on('mouseover', function (e) {
        this.openPopup();
    });


    layer.on('mouseout', function (e) {
        this.closePopup();
    });
}

function onEachFeature2(feature, layer) {

    if (feature.properties) {

        let tableHTML = "<div style='overflow-x: auto; overflow-y: auto; max-height: 500px;'><table style='width:700px;'>"; 

        Object.entries(feature.properties).forEach(([key, value]) => {

            if (key !== "RecID" && key !== "ZeroMeridian" && key !== "StartDay" && key !== "DistUnits" && key !== "LongitudeUnits" && key !== "Calendar" && key !== "TimeOB" && key !== "UTC" && key !== "Lat3" && key !== "Lon3" && key !== "LatInd" && key !== "LonInd" && key !== "WindDirection" && key !== "AllWindDirections" && key !== "WindForce" && key !== "AllWindForces" && key !== "Release" && key !== "CountryFrom" && key !== "CountryTo") {

                tableHTML += "<tr><td style='text-align:center; text-transform: uppercase;'><b>" + key + "</b></td><td>" + value + "</td></tr>";
            }
        });

        tableHTML += "</table></div>";


        layer.bindPopup(tableHTML);


        layer.on('mouseover', function (e) {
            this.openPopup();
        });


        layer.on('mouseout', function (e) {
            this.closePopup();
        });
    }
}




var start= L.geoJSON(start, {
    pointToLayer: function(feature, latlng) {

        return L.marker(latlng, { icon: ShipIcon });
    },
    onEachFeature: onEachFeature2
});





var point = L.geoJSON(point, {
    onEachFeature: createPointPopup,
    pointToLayer: function (feature, latlng) {
        var circleMarker = L.circleMarker(latlng, {
            radius: 4, 
            fillColor: 'darkgreen',
            color: 'darkgreen',
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        });

        circleMarker.on('mouseover', function (e) {
            this.setStyle({
                fillColor: 'lightgreen' 
            })

        });

        circleMarker.on('mouseout', function (e) {
            this.setStyle({
                fillColor: 'darkgreen' 
            })

        });

        return circleMarker;
    }
});





var clusterLayer = L.markerClusterGroup();
clusterLayer.addLayer(start);




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
    layer.on('mouseover', function (e) {
        this.openPopup();
    });


    layer.on('mouseout', function (e) {
        this.closePopup();
    });
}


var routesGeoJSON = L.geoJSON(routes, {
    style: {
        color: 'darkgreen'
    },
    onEachFeature: createRoutesPopup
});


var shipSelect = document.getElementById('shipSelect');

var uniqueShipNames = Array.from(new Set(routes.features.map(function(feature) {
    return feature.properties.ShipName;
})));
uniqueShipNames.sort();


shipSelect.innerHTML = '';


uniqueShipNames.forEach(function(shipName) {
    var option = document.createElement('option');
    option.value = shipName;
    option.text = shipName;
    shipSelect.appendChild(option);
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

    point.eachLayer(function(layer) {
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

var OverlayMaps = {
    "Start": clusterLayer,
    "Routes": routesGeoJSON,
};

start.on('click', function(event) {

    
    var properties = event.layer.feature.properties;

    var voyageIni = properties.VoyageIni;
    var shipName = properties.ShipName;

    routesGeoJSON.eachLayer(function(layer) {
        var layerProperties = layer.feature.properties;
        if (layerProperties.VoyageIni === voyageIni && layerProperties.ShipName === shipName) {

            layer.addTo(map);
        } else {

            map.removeLayer(layer);
        }
    });
    

    point.eachLayer(function(layer) {
        var layerProperties = layer.feature.properties;
    
        if (layerProperties.VoyageIni === voyageIni && layerProperties.ShipName === shipName) {

            layer.addTo(map);      

        } else {

            map.removeLayer(layer);
        }
    });
    
    map.removeLayer(clusterLayer);
});

function zoomToFullExtent() {

    var fullExtentBounds = null;


    map.eachLayer(function(layer) {

        if (layer instanceof L.FeatureGroup && map.hasLayer(layer)) {

            if (fullExtentBounds === null) {
                fullExtentBounds = layer.getBounds();
            } else {
                fullExtentBounds.extend(layer.getBounds());
            }
        }
    });


    if (fullExtentBounds !== null) {
        map.fitBounds(fullExtentBounds);
    }
}





var southWest = L.latLng(-90, -179),
northEast = L.latLng(90, 179),
worldBounds = L.latLngBounds(southWest, northEast);





L.esri.Geocoding.geosearch().addTo(map);

L.control.layers(baseMaps, OverlayMaps).addTo(map);
L.control.scale().addTo(map);

