var myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 10.5
});


function style(feature) {
    return {
        fillColor: getColorCaseRate(feature.properties.casesVsPop),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.6
    };
}

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

var geoData = "../data/boroughShapes2.geojson";
var geojson;


  d3.json(geoData, function(data) {

    // Create a new choropleth layer
    geojson = L.choropleth(data, {
  
      // Define what  property in the features to use
      valueProperty: "casesVsPop",
  
      // Set color scale
      scale: ["#FFFF00", "#FF0000"],
  
      // Number of breaks in step range
      steps: 6,
  
      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },
  
      //Binding a pop-up to each layer
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Borough: " + feature.properties.boro_name + 
        "<br>Population: " + feature.properties.population + 
        "<br>Covid Cases / Population: " + feature.properties.casesVsPop +"%");
      }
    }).addTo(myMap);
  });


