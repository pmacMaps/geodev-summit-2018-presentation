"use strict";

// [1] set-up files and create map object
// construct map object
// reference the id of the element that will contain the map
const map = L.map('map', {
	center: [40.15, -77.25],
	zoom: 10
});

// [2] Basemaps
// Basemaps - L.esri.BasemapLayer class
// pass string for basemap you want
let esriStreets = L.esri.basemapLayer('Streets');

// add to map
esriStreets.addTo(map);

// Group layers
// Imagery with labels
let esriImagery = L.esri.basemapLayer('Imagery');
let esriImageryLabels = L.esri.basemapLayer('ImageryLabels');
let esriTransportationLabels = L.esri.basemapLayer('ImageryTransportation');

// we can group multiple basemap layers into a single layer object using
// the L.layerGroup class
let esriImageryBasemap = L.layerGroup([esriImagery,esriImageryLabels,esriTransportationLabels]);

// Vector basemaps - L.esri.Vector.Basemap
// pass in string for basemap you want
let esriSpring = L.esri.Vector.basemap('Spring'); // can chain .addTo(map) method when constructing the layer to add it to the map

// Create a basemap selector object
// object to hold basemap layers
// we will add control after we create the overlay layers
let baseMaps = {
   "Streets": esriStreets,
   "Satellite": esriImageryBasemap,
   "Spring": esriSpring
};

// Dynamic Map Layer - L.esri.DynamicMapLayer
// if you want to include all sub-layers, just you can construct the map layer this simply
let waterTrails = L.esri.dynamicMapLayer({
    // url of service
    url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Planning/Water_Trails/MapServer'   
}).addTo(map);

// Feature Layer - L.esri.FeatureLayer
// vector graphic display
// can use map or feature service
// must include number at end of service
let landTrails = L.esri.featureLayer({
    // url for service
    url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Planning/Land_Trails/MapServer/0',
    // simplify factor to increase performance
    simplifyFactor: 2,
    // renderer - L.svg() is preferred, but L.canvas() may be better for large polygon layers
    renderer: L.svg()
}).addTo(map);

// create an object to contain overlay layers
// we can add this to our layer selector control
let overlayLayers = {
    "Water Trails": waterTrails,
    "Land Trails": landTrails
};

// add a popup for the land trails
// bind a pop-up
landTrails.bindPopup(function(layer) {
    // we construct an HTML template for the pop-up content
    // value within {} represents a field in the map/feature services
    // you must create helper functions to deal with null or empty strings in records
    // if you don't want to show that in the pop-up
    return L.Util.template('<div class="feat-popup"><h2>{NAME}</h2><p>Trail is {MILES}-miles in length, has a {SURFACE}, and a {BLAZE} blaze</div>', layer.feature.properties);
}, {
    // set max-width of pop-up
    maxWidth: 295,
    // set max-height of pop-up
    maxHeight: 150,
    // close pop-up when map is clicked
    closeOnClick: true
});

// [4] Layer Control 
// Create base map selector control
// reference the basemap group and overlay group
// only one basemap can be selected at a time
// you can turn overlay layers on and off as desired
const basemapSelector = L.control.layers(baseMaps, overlayLayers, {
    // whether control should be collapsed or not
    collapsed: false,
    // position of control
    position: 'topleft'
}).addTo(map);
