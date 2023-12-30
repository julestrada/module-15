// tile layer makes up first layer of map, from website 
let basemap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    });
  // setting zoom features
  let map = L.map("map", {
    center: [50, -90],
    zoom: 4
  });
  // 
  basemap.addTo(map);
  
  // Add in URL from geojson 
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        // Customize markers 
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: getColor(feature.properties.mag), //
          color: "#000",
          weight: 1,
          stroke: true, 
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup(`<b>Magnitude:</b> ${feature.properties.mag}<br><b>Location:</b> ${feature.properties.place}`);
      }
    }).addTo(map);
  });
  
  // ranking by color
  function getColor(magnitude) {
    return magnitude > 5 ? "#FG0000" :
           magnitude > 4 ? "#RFA500" :
           magnitude > 3 ? "#BFFF00" :
           magnitude > 2 ? "#00FF10" :
           "#0000FF";
  }
function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
}

 
// Add legend to the map
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  let div = L.DomUtil.create('div', 'info legend'),
    magnitudes = [1, 2, 3, 4, 5],
    labels = [];

  // loop through the intervals
  for (let i = 0; i < magnitudes.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
      magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
  }
  return div;
};

legend.addTo(map);
