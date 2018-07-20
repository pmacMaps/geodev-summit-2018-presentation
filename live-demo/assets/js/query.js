"use strict";

// [6] Queries
// Queries - L.esri.Query
// attribute or spatial queries
// typically use with a form to gather user inputs

// map/feature service we will query against
let queryUrl = '//gis.ccpa.net/arcgiswebadaptor/rest/services/ArcGIS_Online/LandTrailsData/MapServer/0';

// 1. Attribute Query
// function to run attribute query
// 1. create query object
// 2. set up type of query
// 3. run query
// This query is looking for any features from the land trails service where the value
// in the MILES field is greater than 2 (note because there are not single quotes around
// the 2, it is a numeric field)
function runAttributeQuery() {
    let serviceQuery = L.esri.query({
    // url for query service
    url: queryUrl
    }).where("MILES > 2").run(function(error,trails) {
        if (error) {
            console.log('an error occured');
            // you can do other things, such as get error message and code
        } else {
            // create geojson layer from returned trails
            let results = L.geoJSON(trails);
            // add layer to map
            results.addTo(map);
            // set the map bounds around the trails that were selected
            map.fitBounds(results.getBounds());          
        }
    });
}

// 2. Spatial Queries
// within
// contains
// intersects
// bounding box intersects
// overlap
// nearby

// Nearby Query
// coordinates to search around
let queryCoords = L.latLng(40.2395, -77.0174);
// distance (in meters) for query
// requires ArcGIS Server 10.3+ that includes capabilitysupportQueryWithDistance
// if you are collecting distance in feet, you need to convert the value before
// passing into the function
let distanceForQuery = 4000;

// We are finding all trails within 4,000 meters of the coordinates [40.2395, -77.0174]
function runNearbyQuery() {
    let nearbyQuery = L.esri.query({
        // url for query service
        url: queryUrl
    }).nearby(queryCoords,distanceForQuery).run(function(error,result) {
        if (error) {
            console.log('an error occured');
            // you can do other things, such as get error message and code
        }
        // coordinate we are searching around
        let searchPoint = L.marker(queryCoords).addTo(map);
        // trails that match query
        let resultObject = L.geoJSON(result).addTo(map);
        // set map around the results of the returned trails
        map.fitBounds(resultObject.getBounds());
    });
}

// add event listner to buttons
// this connects executing the function to when the button is clicked or pressed
// attribute query
const attributeQueryButton = document.getElementById('attQueryBtn');
attributeQueryButton.addEventListener('click',runAttributeQuery);

// add event listner to buttons
// this connects executing the function to when the button is clicked or pressed
// spatial query
const spatialQueryButton = document.getElementById('spatialQueryBtn');
spatialQueryButton.addEventListener('click',runNearbyQuery);