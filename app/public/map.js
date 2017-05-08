/* global L XMLHttpRequest */

var nazarethNuggets = (function () { // eslint-disable-line

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

  var icons = {
    food: L.icon({
      iconUrl: './assets/food.png',
      iconSize: [24, 24]
    }),
    nature: L.icon({
      iconUrl: './assets/leaf.png',
      iconSize: [24, 24]
    })
  }

  function addIconsToMap (nuggets) {
  // nuggets is an array of objects which holds the data from the db
    nuggets.forEach(function (nugget) {
      // for each nugget we want to make a marker and put it on the map

      L.marker([nugget.lat, nugget.long], {
        id: nugget.id,
        category: nugget.category,
        title: nugget.title,
        description: nugget.description,
        img_url: nugget.img_url,
        author: nugget.author,
        icon: icons[nugget.category]
      })
      .on('click', function (e) {
        // to be implemented
        console.log(e.target.options)
      })
      .addTo(mymap)
    })
  }

  var mymap = L.map('map', {
    center: [32.699, 35.303],
    zoomControl: false,
    attributionControl: false,
    zoom: 15,
    maxBounds: [
      // bounds for nazareth
      [32.683154, 35.278158],
      [32.723174, 35.341721]
    ],
    minZoom: 13
  })

  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3V1dXVoYSIsImEiOiJjajI2N3QwZm0wMDE1MnFwb3NnYnhwaG55In0.sZgdmc9B4GG9X4Bx5o3NWg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1Ijoia2FyeXVtIiwiYSI6ImNqMjAzNGU4ZjAxa3EycW4xazFxcHZ6a2QifQ.m_dNO1l1sMkM7r4d5nlRRQ'
  }).addTo(mymap)

  // mymap.locate({setView: true})

  function onLocationFound (e) {
    var radius = e.accuracy / 2
    L.marker(e.latlng).addTo(mymap)
    L.circle(e.latlng, radius).addTo(mymap)
  }

  mymap.on('locationfound', onLocationFound)

  var nuggets = [
    {id: 1, lat: 32.691, long: 35.309, category: 'food'},
    {id: 2, lat: 32.690, long: 35.300, category: 'nature'}
  ]

  requestNuggets('GET', '/all-nuggets', function (err, res) {
    if (err) {
      return err
    }
    console.log(res)
  })

  addIconsToMap(nuggets)

  var centerButton = document.querySelector('.center-button')
  centerButton.addEventListener('click', function (e) {
    mymap.locate({setView: true})
  })

  // Amazon S3
  document.querySelector('.class-unknown').onchange = function () {
    const files = document.querySelector('.class-unknown').files
    const file = files[0]
    if (file === null) {
      console.log('No file selected')
    }
    getSignedRequest(file)
  }

  function getSignedRequest (file) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          uploadFile(file, response.signedRequest, response.url)
        } else {
          console.log('Could not get signed URL.')
        }
      }
    }
    xhr.send()
  }

  function uploadFile (file, signedRequest, url) {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', signedRequest)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // adds the url to a hidden input in the form to send it to the server
          document.querySelector('.hidden-class-inform').value = url
        } else {
          console.log('Could not upload file.')
        }
      }
    }
    xhr.send(file)
  }
})()
