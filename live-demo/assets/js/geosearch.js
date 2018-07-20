"use strict";

// [5] Geocoding and Searching within a Layer
// Geocoding - L.esri.Geocoding.Geosearch
// Geocode against Esri World Service or Geocoding service
// Search within feature layer or map service

// Providers
// Esri World Geocode Service
const agolProvider = L.esri.Geocoding.arcgisOnlineProvider({
    // countries to search within; ISO 3166 2 or 3 digit code
    countries: 'USA',
    // categories to limit results to
    categories: 'Address',
    // label for results group
    label: 'ArcGIS Online'
});

// Cumberland County Roads Geocode
const ccpaRoadsProvider = L.esri.Geocoding.geocodeServiceProvider({
    // url for service
    url: '//gis.ccpa.net/arcgiswebadaptor/rest/services/Roads_Locator/GeocodeServer',
    // label for results group
    label: 'Cumberland County',
    // max results returned
    maxResults: 6
});

// Feature Layer - PaMAGIC Members
const pmgMembersProvider = L.esri.Geocoding.featureLayerProvider({
    // url for service
    url: 'https://services1.arcgis.com/1Cfo0re3un0w6a30/ArcGIS/rest/services/PAMAGIC_Members_Region_Limited_092017/FeatureServer/0/',
    // fields to search within
    searchFields: ['First_Name', 'Last_Name', 'Organizati'],
    // format of results
    formatSuggestion: function(feature) {
        return feature.properties.First_Name + ' ' + feature.properties.Last_Name + ' (' + feature.properties.Organizati + ')';
    },
    // label for results
    label: 'PaMAGIC Members',
    // max results
    maxResults: 6
});

// Geosearch control
const geosearchControl = L.esri.Geocoding.geosearch({
    // providers
    providers: [pmgMembersProvider, ccpaRoadsProvider, agolProvider],
    // title for search control tooltip
    title: 'Geosearch Control',
    // placeholder for control
    placeholder: 'Search for address or features',
    // true, false, or zoom level at which to limit resuts to map bounds
    useMapBounds: false,
    // we will select zoom level on the results event
    zoomToResult: false,
    // start geocod control expanded
    expanded: true,
    // keep control expanded after results are found
    collapseAfterResult: false
}).addTo(map);

// container to hold results
let geosearchResults = L.layerGroup().addTo(map);

// results event of search control
geosearchControl.on('results', function(data) {
    // remove previous results
    geosearchResults.clearLayers();
    
    // if there are results, add a marker and popup, and zoom to result
    if (data.results.length > 0) {
        // location of first result object
        let resultLocation = data.results[0].latlng;            
        // text from first result object            
        let resultText = data.results[0].text;
            
        // create marker for result
        // could use a custom icon
        // add this layer to the group layer
        geosearchResults.addLayer(L.marker(resultLocation));
            
        // get first layer in group layer
        // add popup to result object and open
        geosearchResults.getLayers()[0].bindPopup(resultText).openPopup();
    
        // center map on result and zoom to level 18
        map.setView(resultLocation, 18);
    } else { // if no results add message to console
            // add message for no results
            console.log('No results found');
    }       
});