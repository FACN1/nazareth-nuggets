/* global L XMLHttpRequest */

var nazarethNuggets = (function () { // eslint-disable-line

  // bounds for leaflet in format: [south-west, north-east]
  var nazarethBounds = [
    [32.683154, 35.278158],
    [32.723174, 35.341721]
  ]

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

  // function to close an info tab- currently only works for the x button on the tab, needs to be changed to work for e.g. a drag down action or a click on the map.
  function closeTab (e) {
    // the button's parent node is the slide-up-tab
    e.target.parentNode.classList.remove('visible')
    // timeout to allow animation to happen...
    setTimeout(function () {
      document.body.removeChild(e.target.parentNode)
    }, 300)
  }

  function createNuggetInfoTab (info) {
    var nuggetInfoTab = document.createElement('div')
    nuggetInfoTab.setAttribute('class', 'slide-up-tab nugget-info-tab')

    var xButton = document.createElement('i')
    xButton.setAttribute('class', 'slide-up-tab-x-button fa fa-times')
    xButton.setAttribute('aria-hidden', 'true')
    xButton.addEventListener('click', closeTab, {once: true})
    nuggetInfoTab.appendChild(xButton)

    var title = document.createElement('h3')
    title.setAttribute('class', 'nugget-title')
    title.textContent = info.title
    nuggetInfoTab.appendChild(title)

    var author = document.createElement('p')
    author.setAttribute('class', 'nugget-author')
    author.textContent = 'submitted by ' + info.author
    nuggetInfoTab.appendChild(author)

    if (info.img_url) {
      var image = document.createElement('img')
      image.setAttribute('class', 'nugget-image')
      image.setAttribute('src', info.img_url)
      image.setAttribute('alt', info.title)
      nuggetInfoTab.appendChild(image)
    }

    var description = document.createElement('p')
    author.setAttribute('class', 'nugget-description')
    author.textContent = info.description
    nuggetInfoTab.appendChild(description)

    return nuggetInfoTab
  }

  function displayNuggetInfo (e) {
    var nuggetInfo = e.target.options
    var infoTab = createNuggetInfoTab(nuggetInfo)
    document.body.appendChild(infoTab)
    // this setTimeout is kind of ridiculous but it is a way to make the scroll up animation happen
    setTimeout(function () {
      infoTab.classList.add('visible')
    }, 50)
  }

  function createMarker (nugget, iconsMap) {
    return L.marker([nugget.lat, nugget.long], {
      id: nugget.id,
      category: nugget.category,
      title: nugget.title,
      description: nugget.description,
      img_url: nugget.img_url,
      author: nugget.author,
      icon: iconsMap[nugget.category]
    })
    .on('click', displayNuggetInfo)
  }

  function createIconsLayer (nuggets, iconsMap) {
  // nuggets is an array of objects which holds the data from the db
    var markers = nuggets.map(function (nugget) {
      return createMarker(nugget, iconsMap)
    })
    return L.layerGroup(markers)
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

  // these variables are undefined until the db results come back
  var smallIconsLayer
  var bigIconsLayer

  requestNuggets('GET', '/all-nuggets', function (err, nuggets) {
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

  var locationSelectDisplay = document.querySelector('.location-select-display')
  var centerButton = document.querySelector('.center-button')
  centerButton.addEventListener('click', function (e) {
    mymap.locate({setView: true})
  })

  var locationSelectTick = document.querySelector('.location-select-tick')
  locationSelectTick.addEventListener('click', function (e) {
    locationSelectDisplay.classList.toggle('visible')
    // toggle form tab not visible -- future goooal
  })

  var locationSelectCross = document.querySelector('.location-select-cross')
  locationSelectCross.addEventListener('click', function (e) {
    locationSelectDisplay.classList.toggle('visible')
  })

  var addNuggetButton = document.querySelector('.add-nugget-button')
  addNuggetButton.addEventListener('click', function (e) {
    locationSelectDisplay.classList.toggle('visible')
  })
})()
