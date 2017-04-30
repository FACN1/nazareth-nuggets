var mapOptions = {
  zoomControl: false,
  zoom: 18,
  minZoom: 5,
  maxZoom: 20,
}

var mymap = L.map('mapid', mapOptions).setView([32.699, 35.303], 15);

L.tileLayer(
  // mario's custom map
  'https://api.mapbox.com/styles/v1/karyum/cj204pnim003c2sl5jh8aff1d/tiles/256/{z}/{x}/{y}?access_token={accessToken}',
  // default light map
  // 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}',
  // other default map
  // 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
  {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox.light',
    // mario's public access token
    accessToken: 'pk.eyJ1Ijoia2FyeXVtIiwiYSI6ImNqMjAzNGU4ZjAxa3EycW4xazFxcHZ6a2QifQ.m_dNO1l1sMkM7r4d5nlRRQ'
}).addTo(mymap);

// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(function(position) {
//     var lat = position.coords.latitude;
//     var long = position.coords.longitude;
//     console.log('Your Position: ' + lat + ' ' + long);
//     var abc = L.marker([lat, long]).addTo(mymap);
//     mymap.setView([lat, long], 15);
//     return [lat, long]
//   })
// }

var infoPin = L.icon({
  iconUrl: 'customer-service.png'
});
var marker = L.marker([32.7413558, 35.291721959969985], {icon: infoPin}).addTo(mymap);

function onMarkerClick(e) {
  nuggetContainer.classList.toggle('not-visible');
  nuggetContainer.classList.toggle('visible');
  event.stopPropagation();
}

marker.on('click', onMarkerClick);

mymap.on('click', function(e) {
  console.log(mymap.getCenter());
});

var notif = L.icon({
  iconUrl: 'ringing.png'
});

var navgi = L.icon({
  iconUrl: 'compass-circular-variant.png'
})

var marker2 = L.marker([32.69800799736697, 35.3001880645752], {icon: notif}).addTo(mymap) ;
var marker1 = L.marker([32.688798316903686, 35.284910202026374], {icon: navgi}).addTo(mymap);

marker2.on('click', onMarkerClick);
marker1.on('click', onMarkerClick);

var addNuggetButton = document.querySelector('.add-nugget-button');
var map = document.querySelector('.map');
var mapIcons = document.querySelectorAll('.map-icon');

var nuggetContainer = document.querySelector('.nugget-container');
var addNuggetContainer = document.querySelector('.nugget-add-container');

var locationSelect = document.querySelector('.location-select');
var addPinCheckButton = document.querySelector('.add-pin-check');
var addPinTimesButton = document.querySelector('.add-pin-times');

var addFormCheckButton = document.querySelector('.add-form-check');

// nugget info events
//------------------

// bring nugget info onto screen when a map icon is clicked
// mapIcons.forEach(function(icon) {
//   icon.addEventListener('click', function(e) {
//     nuggetContainer.classList.toggle('not-visible');
//     nuggetContainer.classList.toggle('visible');
//     event.stopPropagation();
//   })
// })

// remove nugget info from screen when anywhere is clicked
document.addEventListener('click', function(e) {
  nuggetContainer.classList.add('not-visible');
  nuggetContainer.classList.remove('visible');
})

// add nugget events
//------------------

// show location select screen when add button is clicked
addNuggetButton.addEventListener('click', function(e) {
  locationSelect.classList.toggle('hidden');
  map.classList.toggle('faded');
})

// show add nugget form when location is selected
addPinCheckButton.addEventListener('click', function(e) {
  // show form
  addNuggetContainer.classList.toggle('not-visible');
  addNuggetContainer.classList.toggle('visible');
  // remove location select buttons
  locationSelect.classList.add('hidden');
  map.classList.remove('faded');
  event.stopPropagation();
});

addPinTimesButton.addEventListener('click', function(e) {
  // remove location select buttons
  locationSelect.classList.add('hidden');
  map.classList.remove('faded');
  event.stopPropagation();
});

addFormCheckButton.addEventListener('click', function(e) {
  // hide form
  addNuggetContainer.classList.toggle('not-visible');
  addNuggetContainer.classList.toggle('visible');
});
