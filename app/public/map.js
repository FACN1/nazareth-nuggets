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

  var infoTabCrossButton = document.querySelector('.slide-up-tab-x-button')
  var nuggetInfoTab = document.querySelector('.nugget-info-tab')
  infoTabCrossButton.addEventListener('click', function (e) {
    nuggetInfoTab.classList.toggle('visible')
  })
})()

function createForm () { // eslint-disable-line
  // if (e.defaultPrevented) return

  var addNuggetForm = document.createElement('form')

  var paraTitle1 = document.createElement('P')
  var paraTitle1Attr = document.createTextNode('Title: ')
  paraTitle1.appendChild(paraTitle1Attr)

  var txtBoxTitle1 = document.createElement('input')
  txtBoxTitle1.setAttribute('type', 'text')

  addNuggetForm.appendChild(paraTitle1)
  addNuggetForm.appendChild(txtBoxTitle1)

  var paraCategory2 = document.createElement('P')
  var paraCategory2Attr = document.createTextNode('Category: ')
  paraCategory2.appendChild(paraCategory2Attr)

  var DropDownCategory = document.createElement('select') // input element, text
  DropDownCategory.setAttribute('name', 'DropDownCategoryName')

  var option1 = document.createElement('option') // input element, text
  option1.textContent = 'Food'
  DropDownCategory.appendChild(option1)
  var option2 = document.createElement('option') // input element, text
  option2.textContent = 'Info'
  DropDownCategory.appendChild(option2)
  var option3 = document.createElement('option') // input element, text
  option3.textContent = 'Fun Fact!'
  DropDownCategory.appendChild(option3)
  var option4 = document.createElement('option') // input element, text
  option4.textContent = 'View'
  DropDownCategory.appendChild(option4)

  addNuggetForm.appendChild(paraCategory2)
  addNuggetForm.appendChild(DropDownCategory)

  var paraUpload3 = document.createElement('P')
  var paraUpload3Attr = document.createTextNode('Upload Image: ')
  paraUpload3.appendChild(paraUpload3Attr)

  var uploadBtn1 = document.createElement('input')  // input element, text
  uploadBtn1.setAttribute('type', 'file')
  uploadBtn1.setAttribute('name', 'UploadBtnName')

  addNuggetForm.appendChild(paraUpload3)
  addNuggetForm.appendChild(uploadBtn1)

  var paraDescription4 = document.createElement('P')
  var paraDescription4Attr = document.createTextNode('Description: ')
  paraDescription4.appendChild(paraDescription4Attr)

  var txtBoxDescription1 = document.createElement('textarea')
  var t = document.createTextNode('')
  txtBoxDescription1.setAttribute('class', 'description-text-area')
  txtBoxDescription1.appendChild(t)

  addNuggetForm.appendChild(paraDescription4)
  addNuggetForm.appendChild(txtBoxDescription1)

  var paraName = document.createElement('P')
  var paraNameAttr = document.createTextNode('Your name: ')
  paraName.appendChild(paraNameAttr)

  var txtboxName = document.createElement('input')
  txtboxName.setAttribute('type', 'text')

  addNuggetForm.appendChild(paraName)
  addNuggetForm.appendChild(txtboxName)

  var timesCircleButton = document.createElement('i')
  timesCircleButton.setAttribute('class', 'fa fa-times-circle fa-3x location-select-cross')
  timesCircleButton.setAttribute('aria-hidden', 'true')

  var checkCircleButton = document.createElement('i')
  checkCircleButton.setAttribute('class', '  fa fa-check-circle fa-5x location-select-tick')
  checkCircleButton.setAttribute('aria-hidden', 'true')

  addNuggetForm.appendChild(timesCircleButton)
  addNuggetForm.appendChild(checkCircleButton)

  var newDiv = document.createElement('div')
  newDiv.classList.add('slide-up-tab')
  newDiv.classList.add('add-nugget-tab')
  // newDiv.classList.add('fa-check-circle')
  // newDiv.classList.add('fa-times-circle')
  // newDiv.className = 'slide-up-tab nugget-add-container fa fa-check-circle'
  // console.log(newDiv)
  newDiv.appendChild(addNuggetForm)
  document.body.appendChild(newDiv)
  // slide-up-tab-content
}
