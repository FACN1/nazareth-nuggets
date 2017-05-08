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

  var para1 = document.createElement('P')
  var paraPr1 = document.createTextNode('Title: ')
  para1.appendChild(paraPr1)

  var txtbox1 = document.createElement('input')
  txtbox1.setAttribute('type', 'text')

  ff1.appendChild(para1)
  ff1.appendChild(txtbox1)
  document.getElementsByClassName('slide-up-tab-content')[0].appendChild(ff1)

  var para2 = document.createElement('P')
  var paraPr2 = document.createTextNode('Category: ')
  para2.appendChild(paraPr2)

  var DropDown = document.createElement('select') // input element, text
  DropDown.setAttribute('name', 'dropp') // maybe change?
  DropDown.setAttribute('value', 'Food') // maybe change?

  var option1 = document.createElement('option') // input element, text
  option1.textContent = 'Food'
  DropDown.appendChild(option1)
  var option2 = document.createElement('option') // input element, text
  option2.textContent = 'Info'
  DropDown.appendChild(option2)
  var option3 = document.createElement('option') // input element, text
  option3.textContent = 'Fun Fact!'
  DropDown.appendChild(option3)
  var option4 = document.createElement('option') // input element, text
  option4.textContent = 'View'
  DropDown.appendChild(option4)

  ff1.appendChild(para2)
  ff1.appendChild(DropDown)
  document.getElementsByClassName('slide-up-tab-content')[0].appendChild(ff1)

  var para3 = document.createElement('P')
  var paraPr3 = document.createTextNode('Upload Image: ')
  para3.appendChild(paraPr3)

  var inputBtn1 = document.createElement('input')  // input element, text
  inputBtn1.setAttribute('type', 'file')
  inputBtn1.setAttribute('name', 'inputBtn01')

  ff1.appendChild(para3)
  ff1.appendChild(inputBtn1)

  document.getElementsByClassName('slide-up-tab-content')[0].appendChild(ff1)

  var para5 = document.createElement('P')
  var paraPr5 = document.createTextNode('Description: ')
  para5.appendChild(paraPr5)

  var txtbox2 = document.createElement('textarea')
  var t = document.createTextNode('')
  txtbox2.appendChild(t)

  ff1.appendChild(para5)
  ff1.appendChild(txtbox2)

  document.getElementsByClassName('slide-up-tab-content')[0].appendChild(ff1)

  var para6 = document.createElement('P')
  var paraPr6 = document.createTextNode('Your name: ')
  para6.appendChild(paraPr6)

  var txtbox3 = document.createElement('input')
  txtbox3.setAttribute('type', 'text')

  ff1.appendChild(para6)
  ff1.appendChild(txtbox3)

  document.getElementsByClassName('slide-up-tab-content')[0].appendChild(ff1)
  // document.myFunction.onload = addElement
  // document.body.appendChild(addNuggetButton)

  //  var ff3 = document.createElement("form");
  // f.setAttribute('method',"post");
  // f.setAttribute('action',"submit.php");
  //  document.body.appendChild(ff3);
 /// ///var i = document.createElement("input"); //input element, text
 // i.setAttribute('type',"text");
 // i.setAttribute('name',"username");
 /// ///    ff3.appendChild(i);
// var textbox = document.createElement('input');
// textbox.type = 'text';
// document.getElementById('theForm').appendChild(textbox);
// document.body.appendChild(textbox);

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
