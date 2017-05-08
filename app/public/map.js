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
})()

var addNuggetButton = document.querySelector('.add-nugget-button')
addNuggetButton.addEventListener('click', function (e) {
  // if (e.defaultPrevented) return

  var ff1 = document.createElement('form')

  var paraTitle1 = document.createElement('P')
  var paraTitle1Attr = document.createTextNode('Title: ')
  paraTitle1.appendChild(paraTitle1Attr)

  var txtBoxTitle1 = document.createElement('input')
  txtBoxTitle1.setAttribute('type', 'text')

  ff1.appendChild(paraTitle1)
  ff1.appendChild(txtBoxTitle1)
  document.getElementsByClassName('slide-up-tab-content')[0].appendChild(ff1)

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

  ff1.appendChild(paraCategory2)
  ff1.appendChild(DropDownCategory)
  document.getElementsByClassName('slide-up-tab-content')[0].appendChild(ff1)

  var paraUpload3 = document.createElement('P')
  var paraUpload3Attr = document.createTextNode('Upload Image: ')
  paraUpload3.appendChild(paraUpload3Attr)

  var uploadBtn1 = document.createElement('input')  // input element, text
  uploadBtn1.setAttribute('type', 'file')
  uploadBtn1.setAttribute('name', 'UploadBtnName')

  ff1.appendChild(paraUpload3)
  ff1.appendChild(uploadBtn1)

  document.getElementsByClassName('slide-up-tab-content')[0].appendChild(ff1)

  var paraDescription4 = document.createElement('P')
  var paraDescription4Attr = document.createTextNode('Description: ')
  paraDescription4.appendChild(paraDescription4Attr)

  var txtBoxDescription1 = document.createElement('textarea')
  var t = document.createTextNode('')
  txtBoxDescription1.appendChild(t)

  ff1.appendChild(paraDescription4)
  ff1.appendChild(txtBoxDescription1)

  document.getElementsByClassName('slide-up-tab-content')[0].appendChild(ff1)

  var paraName = document.createElement('P')
  var paraNameAttr = document.createTextNode('Your name: ')
  paraName.appendChild(paraNameAttr)

  var txtboxName = document.createElement('input')
  txtboxName.setAttribute('type', 'text')

  ff1.appendChild(paraName)
  ff1.appendChild(txtboxName)

  document.getElementsByClassName('slide-up-tab-content')[0].appendChild(ff1)

  var timesCircleButton = document.createElement('i')
  timesCircleButton.setAttribute('class', 'fa fa-times-circle fa-3x location-select-cross')
  timesCircleButton.setAttribute('aria-hidden', 'true')
  ff1.appendChild(timesCircleButton)
  document.getElementsByClassName('slide-up-tab-content')[0].appendChild(ff1)

  var checkCircleButton = document.createElement('i')
  checkCircleButton.setAttribute('class', '  fa fa-check-circle fa-5x location-select-tick')
  checkCircleButton.setAttribute('aria-hidden', 'true')
  ff1.appendChild(checkCircleButton)
  document.getElementsByClassName('slide-up-tab-content')[0].appendChild(ff1)

  var newDiv = document.createElement('div')
  newDiv.classList.add('slide-up-tab')
  newDiv.classList.add('nugget-add-container')
  // newDiv.classList.add('fa-check-circle')
  // newDiv.classList.add('fa-times-circle')
  // newDiv.className = 'slide-up-tab nugget-add-container fa fa-check-circle'
  // console.log(newDiv)
  newDiv.appendChild(ff1)
  document.body.appendChild(newDiv)
  // slide-up-tab-content
})
