/* global L XMLHttpRequest */

var nazarethNuggets = (function () { // eslint-disable-line

  // bounds for leaflet in format: [south-west, north-east]
  var nazarethBounds = [
    [32.683154, 35.278158],
    [32.723174, 35.341721]
  ]

  function requestNuggets (method, url, callback) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText)
        callback(null, response)
      }
      if (xhr.status === 500) {
        callback(new Error('Status code:' + xhr.status))
      }
    }
    xhr.open(method, url)
    xhr.send()
  }

  var bigIconsMap = {
    food: L.icon({
      iconUrl: './assets/food.png',
      iconSize: [24, 24]
    }),
    nature: L.icon({
      iconUrl: './assets/nature.png',
      iconSize: [24, 24]
    }),
    exclamation: L.icon({
      iconUrl: './assets/exclamation.png',
      iconSize: [24, 24]
    })
  }

  var smallIconsMap = {
    food: L.icon({
      iconUrl: './assets/food-small.png',
      iconSize: [8, 8]
    }),
    nature: L.icon({
      iconUrl: './assets/nature-small.png',
      iconSize: [8, 8]
    }),
    exclamation: L.icon({
      iconUrl: './assets/exclamation-small.png',
      iconSize: [8, 8]
    })
  }

  function createIconsLayer (nuggets, iconsMap) {
  // nuggets is an array of objects which holds the data from the db
    var icons = nuggets.map(function (nugget) {
      // for each nugget we want to make a marker and put it on the map
      return L.marker([nugget.lat, nugget.long], {
        id: nugget.id,
        category: nugget.category,
        title: nugget.title,
        description: nugget.description,
        img_url: nugget.img_url,
        author: nugget.author,
        icon: iconsMap[nugget.category]
      })
      .on('click', function (e) {
        // to be implemented
        console.log(e.target.options)
      })
    })
    return L.layerGroup(icons)
  }

  var mymap = L.map('map', {
    center: [32.699, 35.303],
    zoomControl: false,
    attributionControl: false,
    zoom: 15,
    maxBounds: nazarethBounds,
    minZoom: 13
  })

  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3V1dXVoYSIsImEiOiJjajI2N3QwZm0wMDE1MnFwb3NnYnhwaG55In0.sZgdmc9B4GG9X4Bx5o3NWg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1Ijoia2FyeXVtIiwiYSI6ImNqMjAzNGU4ZjAxa3EycW4xazFxcHZ6a2QifQ.m_dNO1l1sMkM7r4d5nlRRQ'
  }).addTo(mymap)

  mymap.locate({setView: true})

  function onLocationFound (e) {
    var radius = e.accuracy / 2
    L.marker(e.latlng).addTo(mymap)
    L.circle(e.latlng, radius).addTo(mymap)
  }

  mymap.on('locationfound', onLocationFound)

  var nuggets
  // these variables are undefined until the db results come back
  var smallIconsLayer
  var bigIconsLayer

  requestNuggets('GET', '/all-nuggets', function (err, res) {
    if (err) {
      // need to improve this
      return err
    }
    smallIconsLayer = createIconsLayer(nuggets, smallIconsMap)
    smallIconsLayer.addTo(mymap)
    bigIconsLayer = createIconsLayer(nuggets, bigIconsMap)
  })

  var displayCorrectIcons = function (e) {
    // small icons if zoomed less than level 15, big icons otherwise
    if (mymap.getZoom() < 15) {
      smallIconsLayer.addTo(mymap)
      bigIconsLayer.removeFrom(mymap)
    } else {
      smallIconsLayer.removeFrom(mymap)
      bigIconsLayer.addTo(mymap)
    }
  }

  // on zoomend is good but not perfect, because can zoom multiple levels before this function will re-run
  mymap.on('zoomend', displayCorrectIcons)

  var centerButton = document.querySelector('.center-button')
  centerButton.addEventListener('click', function (e) {
    mymap.locate({setView: true})
  })
})()
