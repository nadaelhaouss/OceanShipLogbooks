
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
    



var ShipIcon = L.icon({
        iconUrl: 'Data/img/navire.png',
    
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
    var Direction = feature.properties.WindDirection;
    var popupContent = DD + " / " + MM + " / " + YY + "&nbsp;&nbsp;&nbsp;&nbsp;" + "<br>"+ "<b>Wind Direction :   </b>" + Direction; 

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



const windIcon = L.icon({
    iconUrl: 'Data/img/fleche.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});


function rotate(feature) {
    const windDirection = feature.properties.WindDirection;
    return windDirectionToDegrees(windDirection);
}




var point1 = L.geoJSON(point1, {
    onEachFeature: createPointPopup,
    pointToLayer: function(feature, latlng) 
        {

            var direction = windDirectionToDegrees(feature.properties.WindDirection);
            if (direction !== -1) {
                return L.marker(latlng, { 
                    icon: windIcon,
                    rotationAngle: direction
                });
            } else {
            var circleMarker = L.circleMarker(latlng, {
                radius: 3,
                color: '#016c59', 
                fillColor: '#016c59',
                fillOpacity: 1
            });

            circleMarker.on('mouseover', function(event) {
                circleMarker.setStyle({ color: 'lightgreen', fillColor: 'green' });
            });

            circleMarker.on('mouseout', function(event) {
                circleMarker.setStyle({ color: '#016c59', fillColor: '#016c59' });
            });

            return circleMarker;
        }
    }
});

var point2 = L.geoJSON(point2, {
    onEachFeature: createPointPopup,
    pointToLayer: function(feature, latlng) 
        {
            var direction = windDirectionToDegrees(feature.properties.WindDirection);
            if (direction !== -1) {
                return L.marker(latlng, { 
                    icon: windIcon,
                    rotationAngle: direction
                });
            } else {
            var circleMarker = L.circleMarker(latlng, {
                radius: 3,
                color: '#016c59', 
                fillColor: '#016c59',
                fillOpacity: 1
            });
            circleMarker.on('mouseover', function(event) {
                circleMarker.setStyle({ color: 'lightgreen', fillColor: 'green' });
            });

            circleMarker.on('mouseout', function(event) {
                circleMarker.setStyle({ color: '#016c59', fillColor: '#016c59' });
            });

            return circleMarker;
        }
    }
});

var point3 = L.geoJSON(point3, {
    onEachFeature: createPointPopup,
    pointToLayer: function(feature, latlng) 
        {
            var direction = windDirectionToDegrees(feature.properties.WindDirection);
            if (direction !== -1) {
                return L.marker(latlng, { 
                    icon: windIcon,
                    rotationAngle: direction
                });
            } else {
            var circleMarker = L.circleMarker(latlng, {
                radius: 3,
                color: '#016c59', 
                fillColor: '#016c59',
                fillOpacity: 1
            });

            circleMarker.on('mouseover', function(event) {
                circleMarker.setStyle({ color: 'lightgreen', fillColor: 'green' });
            });

            circleMarker.on('mouseout', function(event) {
                circleMarker.setStyle({ color: '#016c59', fillColor: '#016c59' });
            });

            return circleMarker;
        }
    }
});

var point4 = L.geoJSON(point4, {
    onEachFeature: createPointPopup,
    pointToLayer: function(feature, latlng) 
        {
            var direction = windDirectionToDegrees(feature.properties.WindDirection);
            if (direction !== -1) {
                return L.marker(latlng, { 
                    icon: windIcon,
                    rotationAngle: direction
                });
            } else {
            var circleMarker = L.circleMarker(latlng, {
                radius: 3,
                color: '#016c59',
                fillColor: '#016c59',
                fillOpacity: 1
            });

            circleMarker.on('mouseover', function(event) {
                circleMarker.setStyle({ color: 'lightgreen', fillColor: 'green' });
            });

            circleMarker.on('mouseout', function(event) {
                circleMarker.setStyle({ color: '#016c59', fillColor: '#016c59' });
            });

            return circleMarker;
        }
    }
});

var point5 = L.geoJSON(point5, {
    onEachFeature: createPointPopup,
    pointToLayer: function(feature, latlng) 
        {

            var direction = windDirectionToDegrees(feature.properties.WindDirection);
            if (direction !== -1) {
                return L.marker(latlng, { 
                    icon: windIcon,
                    rotationAngle: direction
                });
            } else {
            var circleMarker = L.circleMarker(latlng, {
                radius: 3,
                color: '#016c59', 
                fillColor: '#016c59',
                fillOpacity: 1
            });

            circleMarker.on('mouseover', function(event) {
                circleMarker.setStyle({ color: 'lightgreen', fillColor: 'green' });
            });

            circleMarker.on('mouseout', function(event) {
                circleMarker.setStyle({ color: '#016c59', fillColor: '#016c59' });
            });

            return circleMarker;
        }
    }
});

var point6 = L.geoJSON(point6, {
    onEachFeature: createPointPopup,
    pointToLayer: function(feature, latlng) 
        {

            var direction = windDirectionToDegrees(feature.properties.WindDirection);
            if (direction !== -1) {
                return L.marker(latlng, { 
                    icon: windIcon,
                    rotationAngle: direction
                });
            } else {
            var circleMarker = L.circleMarker(latlng, {
                radius: 3,
                color: '#016c59', 
                fillColor: '#016c59',
                fillOpacity: 1
            });

            circleMarker.on('mouseover', function(event) {
                circleMarker.setStyle({ color: 'lightgreen', fillColor: 'green' });
            });

            circleMarker.on('mouseout', function(event) {
                circleMarker.setStyle({ color: '#016c59', fillColor: '#016c59' });
            });

            return circleMarker;
        }
    }
});













var clusterLayer = L.markerClusterGroup();
clusterLayer.addLayer(start);




var map = L.map('map', {
    center: [25.2450349,-37.3618424],
    zoom: 3,
    layers: [darkLayer]
});


function windDirectionToDegrees(direction) {
    switch (direction) {
        case "N":
            return 0;
        case "NNE":
            return 22.5;
        case "NE":
            return 45;
        case "ENE":
            return 67.5;
        case "E":
            return 90;
        case "ESE":
            return 112.5;
        case "SE":
            return 135;
        case "SSE":
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
            
            return -1 ;
    }
}


function createRoutesPopup(feature, layer) {
    var voyageIni = feature.properties.VoyageIni;
    var shipName = feature.properties.ShipName;

    var popupContent = "<b>Ship Name:</b> " + shipName + "<br>" +
                       "<b>Voyage Initiation:</b> " + voyageIni;

    layer.bindPopup(popupContent);

}


var routesGeoJSON = L.geoJSON(routes, {
    style: {
        color: '#016c59'
    },
    onEachFeature: createRoutesPopup
});

var shipSelect = document.getElementById('shipSelect');
var yearSelect = document.getElementById('yearSelect');
var voyageSelect = document.getElementById('voyageSelect');

function populateDropdown(selectElement, options) {
    selectElement.innerHTML = '';
    options.forEach(function(optionValue) {
        var option = document.createElement('option');
        option.value = optionValue;
        option.text = optionValue;
        selectElement.appendChild(option);
    });
}

function updateDropdownOptions(selectElement, options) {
    var selectedValue = selectElement.value;
    populateDropdown(selectElement, options);
    selectElement.value = selectedValue; 
}

function updateYearAndVoyageOptions(selectedShipName, selectedYear, selectedVoyage) {
    var filteredFeatures = routes.features.filter(function(feature) {
        return (selectedShipName === 'All' || feature.properties.ShipName === selectedShipName) &&
               (selectedYear === 'All' || feature.properties.Year.toString() === selectedYear) &&
               (selectedVoyage === 'All' || feature.properties.VoyageIni.toString() === selectedVoyage);
    });

    var uniqueYears = Array.from(new Set(filteredFeatures.map(function(feature) {
        return feature.properties.Year;
    }))).sort();
    
    var uniqueVoyages = Array.from(new Set(filteredFeatures.map(function(feature) {
        return feature.properties.VoyageIni;
    }))).sort();

    uniqueYears.unshift('All');
    uniqueVoyages.unshift('All');

    updateDropdownOptions(yearSelect, uniqueYears);
    updateDropdownOptions(voyageSelect, uniqueVoyages);
}

function updateShipOptions(selectedYear, selectedVoyage) {
    var filteredFeatures = routes.features.filter(function(feature) {
        return (selectedYear === 'All' || feature.properties.Year.toString() === selectedYear) &&
               (selectedVoyage === 'All' || feature.properties.VoyageIni.toString() === selectedVoyage);
    });

    var uniqueShipNames = Array.from(new Set(filteredFeatures.map(function(feature) {
        return feature.properties.ShipName;
    }))).sort();
    
    uniqueShipNames.unshift('All');
    
    updateDropdownOptions(shipSelect, uniqueShipNames);
}

function filterData() {

    var selectedShipName = shipSelect.value;
    var selectedYear = yearSelect.value;
    var selectedVoyage = voyageSelect.value;
    var filteredFeaturesCount = 0;

    routesGeoJSON.eachLayer(function(layer) {
        var shipNameMatch = selectedShipName === 'All' || layer.feature.properties.ShipName === selectedShipName;
        var yearMatch = selectedYear === 'All' || layer.feature.properties.Year.toString() === selectedYear;
        var voyageMatch = selectedVoyage === 'All' || layer.feature.properties.VoyageIni.toString() === selectedVoyage;

        if (shipNameMatch && yearMatch && voyageMatch) {
            layer.addTo(map);
            filteredFeaturesCount++;
        } else {
            map.removeLayer(layer);
        }
    });
    point1.eachLayer(function(layer) {
        var shipNameMatch = selectedShipName === 'All' || layer.feature.properties.ShipName === selectedShipName;
        var yearMatch = selectedYear === 'All' || layer.feature.properties.Year.toString() === selectedYear;
        var voyageMatch = selectedVoyage === 'All' || layer.feature.properties.VoyageIni.toString() === selectedVoyage;

        if (shipNameMatch && yearMatch && voyageMatch) {
            layer.addTo(map);      
        } else {
            map.removeLayer(layer);
        }
    });
    point2.eachLayer(function(layer) {
        var shipNameMatch = selectedShipName === 'All' || layer.feature.properties.ShipName === selectedShipName;
        var yearMatch = selectedYear === 'All' || layer.feature.properties.Year.toString() === selectedYear;
        var voyageMatch = selectedVoyage === 'All' || layer.feature.properties.VoyageIni.toString() === selectedVoyage;

        if (shipNameMatch && yearMatch && voyageMatch) {
            layer.addTo(map);      
        } else {
            map.removeLayer(layer);
        }
    });
    point3.eachLayer(function(layer) {
        var shipNameMatch = selectedShipName === 'All' || layer.feature.properties.ShipName === selectedShipName;
        var yearMatch = selectedYear === 'All' || layer.feature.properties.Year.toString() === selectedYear;
        var voyageMatch = selectedVoyage === 'All' || layer.feature.properties.VoyageIni.toString() === selectedVoyage;

        if (shipNameMatch && yearMatch && voyageMatch) {
            layer.addTo(map);      
        } else {
            map.removeLayer(layer);
        }
    });
    point4.eachLayer(function(layer) {
        var shipNameMatch = selectedShipName === 'All' || layer.feature.properties.ShipName === selectedShipName;
        var yearMatch = selectedYear === 'All' || layer.feature.properties.Year.toString() === selectedYear;
        var voyageMatch = selectedVoyage === 'All' || layer.feature.properties.VoyageIni.toString() === selectedVoyage;

        if (shipNameMatch && yearMatch && voyageMatch) {
            layer.addTo(map);      
        } else {
            map.removeLayer(layer);
        }
    });
    point5.eachLayer(function(layer) {
        var shipNameMatch = selectedShipName === 'All' || layer.feature.properties.ShipName === selectedShipName;
        var yearMatch = selectedYear === 'All' || layer.feature.properties.Year.toString() === selectedYear;
        var voyageMatch = selectedVoyage === 'All' || layer.feature.properties.VoyageIni.toString() === selectedVoyage;

        if (shipNameMatch && yearMatch && voyageMatch) {
            layer.addTo(map);      
        } else {
            map.removeLayer(layer);
        }
    });
    point6.eachLayer(function(layer) {
        var shipNameMatch = selectedShipName === 'All' || layer.feature.properties.ShipName === selectedShipName;
        var yearMatch = selectedYear === 'All' || layer.feature.properties.Year.toString() === selectedYear;
        var voyageMatch = selectedVoyage === 'All' || layer.feature.properties.VoyageIni.toString() === selectedVoyage;

        if (shipNameMatch && yearMatch && voyageMatch) {
            layer.addTo(map);      
        } else {
            map.removeLayer(layer);
        }
    });
    alert(filteredFeaturesCount + " features found.");
}

function applyFilters() {
    filterData();
}

shipSelect.addEventListener('change', function() {
    var selectedShipName = shipSelect.value;
    var selectedYear = yearSelect.value;
    var selectedVoyage = voyageSelect.value;
    updateYearAndVoyageOptions(selectedShipName, selectedYear, selectedVoyage);
});

yearSelect.addEventListener('change', function() {
    var selectedYear = yearSelect.value;
    var selectedVoyage = voyageSelect.value;
    updateShipOptions(selectedYear, selectedVoyage);
    var selectedShipName = shipSelect.value;
    updateYearAndVoyageOptions(selectedShipName, selectedYear, selectedVoyage);
});

voyageSelect.addEventListener('change', function() {
    var selectedYear = yearSelect.value;
    var selectedVoyage = voyageSelect.value;
    updateShipOptions(selectedYear, selectedVoyage);
    var selectedShipName = shipSelect.value;
    updateYearAndVoyageOptions(selectedShipName, selectedYear, selectedVoyage);
});


var allShipNames = ['All'].concat(Array.from(new Set(routes.features.map(function(feature) {
    return feature.properties.ShipName;
}))).sort());
populateDropdown(shipSelect, allShipNames);

var allYears = ['All'].concat(Array.from(new Set(routes.features.map(function(feature) {
    return feature.properties.Year;
}))).sort());
populateDropdown(yearSelect, allYears);

var allVoyages = ['All'].concat(Array.from(new Set(routes.features.map(function(feature) {
    return feature.properties.VoyageIni;
}))).sort());
populateDropdown(voyageSelect, allVoyages);


var OverlayMaps = {
    "Departure Points": clusterLayer,
    "Ship Roads": routesGeoJSON,
};

start.on('click', function(event) {
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    
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
    

    point1.eachLayer(function(layer) {

        var layerProperties = layer.feature.properties;
    
        if (layerProperties.VoyageIni === voyageIni && layerProperties.ShipName === shipName) {

            layer.addTo(map);       

        } else {

            map.removeLayer(layer);
        }
    });
    point2.eachLayer(function(layer) {

        var layerProperties = layer.feature.properties;
    
        if (layerProperties.VoyageIni === voyageIni && layerProperties.ShipName === shipName) {

            layer.addTo(map);       

        } else {

            map.removeLayer(layer);
        }
    });
    point3.eachLayer(function(layer) {

        var layerProperties = layer.feature.properties;
    
        if (layerProperties.VoyageIni === voyageIni && layerProperties.ShipName === shipName) {

            layer.addTo(map);       

        } else {

            map.removeLayer(layer);
        }
    });
    point4.eachLayer(function(layer) {

        var layerProperties = layer.feature.properties;
    
        if (layerProperties.VoyageIni === voyageIni && layerProperties.ShipName === shipName) {

            layer.addTo(map);       

        } else {

            map.removeLayer(layer);
        }
    });
    point5.eachLayer(function(layer) {

        var layerProperties = layer.feature.properties;
    
        if (layerProperties.VoyageIni === voyageIni && layerProperties.ShipName === shipName) {

            layer.addTo(map);       

        } else {

            map.removeLayer(layer);
        }
    });
    point6.eachLayer(function(layer) {

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

function resetFilters() {
    
    document.getElementById("shipSelect").selectedIndex = 0;
    document.getElementById("yearSelect").selectedIndex = 0;
    document.getElementById("voyageSelect").selectedIndex = 0;
    
    
    populateDropdown(shipSelect, allShipNames);
    populateDropdown(yearSelect, allYears);
    populateDropdown(voyageSelect, allVoyages);
}

L.Control.QueryControl = L.Control.extend({
    onAdd: function (map) {
      const Queryy = [
        "Query Test...",
        "Shortest trip",
        "Longest trip"
      ];

      const select = L.DomUtil.create("select", "");
      select.setAttribute("id", "QueryTest");
      select.setAttribute("style", "font-size: 16px;padding:4px 8px;");
      Queryy.forEach(function (queryy) {
        let option = L.DomUtil.create("option");
        option.innerHTML = queryy;
        select.appendChild(option);
      });
      return select;

    },

    onRemove: function (map) {
      // Nothing to do here
    }
  });


  L.control.queryControl = function (opts) {
    return new L.Control.QueryControl(opts);
  };

  L.control
    .queryControl({
      position: "topright"
    })
    .addTo(map);

let maxLength = -Infinity;
let minLength = Infinity;

routesGeoJSON.eachLayer(function (layer) {
    if (layer instanceof L.Polyline) {
        let length = turf.length(layer.toGeoJSON(), { units: 'kilometers' });
        if (length === 0) {
            console.log("Skipping feature with length 0:", layer.feature.properties);
            return; 
        }
        layer.feature.properties.length = length; 
        if (length > maxLength) {
            maxLength = length;
        }
        if (length < minLength) {
            minLength = length;
        }
    }
});
console.log("Max Length:", maxLength);
console.log("Min Length:", minLength);

const select = document.getElementById("QueryTest");
select.addEventListener("change", () => {
    map.eachLayer(function(layer) {
            map.removeLayer(layer);
        }
    });
    const selectedValue = select.value;
    if (selectedValue !== "") {
        if (selectedValue === "Shortest trip" || selectedValue === "Longest trip") {
            let shortestLength = Infinity;
            let longestLength = 0;
            let shortestTrip;
            let longestTrip;
            routesGeoJSON.eachLayer(function (layer) {
                if (layer instanceof L.Polyline) {
                    let length = turf.length(layer.toGeoJSON(), { units: 'kilometers' });

                    if (length < shortestLength) {
                        shortestLength = length;
                        shortestTrip = layer;
                    }
                    if (length > longestLength) {
                        longestLength = length;
                        longestTrip = layer;
                    }
                }
            });

            if (selectedValue === "Shortest trip") {
                routesGeoJSON.eachLayer(function (layer) {
                    if (layer instanceof L.Polyline) {
                        let length = turf.length(layer.toGeoJSON(), { units: 'kilometers' });
                        if (length === shortestLength) {
                            layer.addTo(map);map.fitBounds(layer.getBounds());
                        } else {
                            map.removeLayer(layer);
                        }
                    }
                });
            } else if (selectedValue === "Longest trip") {
                routesGeoJSON.eachLayer(function (layer) {
                    if (layer instanceof L.Polyline) {
                        let length = turf.length(layer.toGeoJSON(), { units: 'kilometers' });
                        if (length === longestLength) {
                            layer.addTo(map);map.fitBounds(layer.getBounds());
                        } else {
                            map.removeLayer(layer);
                        }
                    }
                });
            }
        }
    }
});






var southWest = L.latLng(-90, -179),
northEast = L.latLng(90, 179),
worldBounds = L.latLngBounds(southWest, northEast);


L.Measure = {
    linearMeasurement: "Distance measurement",
    areaMeasurement: "Area measurement",
    start: "Start",
    meter: "m",
    kilometer: "km",
    squareMeter: "m²",
    squareKilometers: "km²",
    };

var measure = L.control.measure({}).addTo(map);
L.esri.Geocoding.geosearch().addTo(map);

L.control.layers(baseMaps, OverlayMaps).addTo(map);
L.control.scale().addTo(map);

