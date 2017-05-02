/* global L */
(function () {
  var bounds = L.latLngBounds([32.683154, 35.278158], [32.723174, 35.341721])
  var mymap = L.map('map', {
    center: [32.699, 35.303],
    zoom: 13,
    maxBounds: bounds,
    minZoom: 13
  })

  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3V1dXVoYSIsImEiOiJjajI2N3QwZm0wMDE1MnFwb3NnYnhwaG55In0.sZgdmc9B4GG9X4Bx5o3NWg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1Ijoia2FyeXVtIiwiYSI6ImNqMjAzNGU4ZjAxa3EycW4xazFxcHZ6a2QifQ.m_dNO1l1sMkM7r4d5nlRRQ'
  }).addTo(mymap)

  mymap.locate({setView: true, maxZoom: 20})

  function onLocationFound (e) {
    var radius = e.accuracy / 2

    L.marker(e.latlng).addTo(mymap)

    L.circle(e.latlng, radius).addTo(mymap)
  }

  function onLocationError (e) {
    window.confirm(e.message = 'Your location was not found')
  }

  mymap.on('locationerror', onLocationError)
  mymap.on('locationfound', onLocationFound)
})()
