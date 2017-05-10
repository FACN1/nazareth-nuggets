/* global L XMLHttpRequest */

(function () { // eslint-disable-line

  var TAB_ANIMATION_DURATION = 300

  // bounds for leaflet in format: [south-west, north-east]
  var nazarethBounds = [
    [32.683154, 35.278158],
    [32.723174, 35.341721]
  ]

  var bigIconsMap = {
    food: L.icon({
      iconUrl: './assets/icons/food.png',
      iconSize: [24, 24]
    }),
    'fun fact': L.icon({
      iconUrl: './assets/icons/fun-fact.png',
      iconSize: [24, 24]
    }),
    history: L.icon({
      iconUrl: './assets/icons/history.png',
      iconSize: [24, 24]
    }),
    information: L.icon({
      iconUrl: './assets/icons/information.png',
      iconSize: [24, 24]
    }),
    nature: L.icon({
      iconUrl: './assets/icons/nature.png',
      iconSize: [24, 24]
    }),
    viewpoint: L.icon({
      iconUrl: './assets/icons/viewpoint.png',
      iconSize: [24, 24]
    })
  }

  var smallIconsMap = {
    food: L.icon({
      iconUrl: './assets/icons-small/food-small.png',
      iconSize: [8, 8]
    }),
    'fun fact': L.icon({
      iconUrl: './assets/icons-small/fun-fact-small.png',
      iconSize: [8, 8]
    }),
    history: L.icon({
      iconUrl: './assets/icons-small/history-small.png',
      iconSize: [8, 8]
    }),
    information: L.icon({
      iconUrl: './assets/icons-small/information-small.png',
      iconSize: [8, 8]
    }),
    nature: L.icon({
      iconUrl: './assets/icons-small/nature-small.png',
      iconSize: [8, 8]
    }),
    viewpoint: L.icon({
      iconUrl: './assets/icons-small/viewpoint-small.png',
      iconSize: [8, 8]
    })
  }

  function makeRequest (method, url, data, callback) {
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
    if (data) {
      xhr.setRequestHeader('content-type', 'application/json')
      return (xhr.send(JSON.stringify(data)))
    }
    xhr.send()
  }

  // function to close an info tab- currently only works for the x button on the tab, needs to be changed to work for e.g. a drag down action or a click on the map.
  function closeTab (e) {
    // the button's parent node is the slide-up-tab
    e.target.parentNode.classList.remove('visible')
    // timeout to allow animation to happen...
    setTimeout(function () {
      document.body.removeChild(e.target.parentNode)
    }, TAB_ANIMATION_DURATION)
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
    description.setAttribute('class', 'nugget-description')
    description.textContent = info.description
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

  function displayForm (e) {
    locationSelectDisplay.classList.remove('visible')
    var clickedLocation = mymap.getCenter()
    var addNuggetFormTab = createForm(clickedLocation.lat, clickedLocation.lng)
    document.body.appendChild(addNuggetFormTab)
    setTimeout(function () {
      addNuggetFormTab.classList.add('visible')
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

  // USER LOCATION
  // don't really want to set coordinates here and add to map but I think I have to
  var userLocationMarker = L.marker([0, 0]).addTo(mymap)
  var userLocationRadius = L.circle([0, 0], 1).addTo(mymap)
  var isWatchingUser = false

  function onLocationFound (e) {
    var radius = e.accuracy / 2
    userLocationMarker.setLatLng(e.latlng)
    userLocationRadius.setLatLng(e.latlng)
    userLocationRadius.setRadius(radius)
  }

  mymap.on('locationfound', onLocationFound)
  // center on the user's location on initial load
  mymap.locate({setView: true})

  // these variables are undefined until the db results come back
  var smallIconsLayer
  var bigIconsLayer

  makeRequest('GET', '/all-nuggets', null, function (err, nuggets) {
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

  function submitForm (e) {
    // get data from form fields
    var form = e.target.parentNode.parentNode
    var inputs = form.querySelectorAll('.add-form-input')
    var formData = {}
    inputs.forEach(function (input) {
      formData[input.name] = input.value
    })
    // validate data
    function validateData (formData) {
      if (formData.title.trim() === '') return false
      if (formData.description.trim() === '') return false
      if (formData.author.trim() === '') return false
      return true
    }
    if (!validateData(formData)) {
      // display message
      var errorMessage = document.querySelector('.err-message')
      errorMessage.textContent = '*Please fill in the form'
      return
    }
    // send data to server
    makeRequest('POST', '/add-nugget', formData, function (err) {
      if (err) {
        // pop up error message suggesting try to submit the orm again
        return
      }
      // put pin on map (currently commented out awaiting implementation)
      // addNuggetToMap(formData)
      createMarker(formData, smallIconsMap).addTo(smallIconsLayer)
      createMarker(formData, bigIconsMap).addTo(bigIconsLayer)
      // remove form from page
      form.parentNode.classList.remove('visible')
      setTimeout(function () {
        document.body.removeChild(form.parentNode)
      }, TAB_ANIMATION_DURATION)
    })
  }

  var locationSelectDisplay = document.querySelector('.location-select-display')
  var centerButton = document.querySelector('.center-button')
  centerButton.addEventListener('click', function (e) {
    if (isWatchingUser) {
      mymap.stopLocate()
      centerButton.classList.remove('blue')
    } else {
      centerButton.classList.add('blue')
      mymap.locate({setView: true, watch: true})
    }
    isWatchingUser = !isWatchingUser
  })

  var locationSelectTick = document.querySelector('.location-select-tick')
  locationSelectTick.addEventListener('click', displayForm)

  var locationSelectCross = document.querySelector('.location-select-cross')
  locationSelectCross.addEventListener('click', function (e) {
    locationSelectDisplay.classList.toggle('visible')
  })

  var addNuggetButton = document.querySelector('.add-nugget-button')
  addNuggetButton.addEventListener('click', function (e) {
    locationSelectDisplay.classList.toggle('visible')
  })

  function createForm (lat, lng) { // eslint-disable-line
    // creates the form
    var addNuggetForm = document.createElement('form')

    // create the nugget title and its input then renders it to the form
    var paraTitle1 = document.createElement('P')
    var paraTitle1Attr = document.createTextNode('Title: ')
    paraTitle1.classList.add('formPara')
    paraTitle1.appendChild(paraTitle1Attr)

    var txtBoxTitle1 = document.createElement('input')
    txtBoxTitle1.setAttribute('type', 'text')
    txtBoxTitle1.setAttribute('name', 'title')
    txtBoxTitle1.classList.add('add-form-input')

    addNuggetForm.appendChild(paraTitle1)
    addNuggetForm.appendChild(txtBoxTitle1)

    // create category and its select then renders it to the form
    var paraCategory2 = document.createElement('P')
    var paraCategory2Attr = document.createTextNode('Category: ')
    paraCategory2.classList.add('formPara')
    paraCategory2.appendChild(paraCategory2Attr)

    var DropDownCategory = document.createElement('select') // input element, text
    DropDownCategory.setAttribute('name', 'category')
    DropDownCategory.classList.add('add-form-category-input')
    DropDownCategory.classList.add('add-form-input')

    var categories = [
      {value: 'fun fact', textContent: 'Fun fact'},
      {value: 'viewpoint', textContent: 'Viewpoint'},
      {value: 'history', textContent: 'History'},
      {value: 'nature', textContent: 'Nature'},
      {value: 'information', textContent: 'Information'},
      {value: 'food', textContent: 'Food'}
    ]

    categories.forEach(function (category) {
      var option = document.createElement('option')
      option.setAttribute('value', category.value)
      option.textContent = category.textContent
      DropDownCategory.appendChild(option)
    })

    addNuggetForm.appendChild(paraCategory2)
    addNuggetForm.appendChild(DropDownCategory)

    // creates image input element and renders it to the form
    var paraUpload3 = document.createElement('P')
    var paraUpload3Attr = document.createTextNode('Upload Image: ')
    paraUpload3.classList.add('formPara')
    paraUpload3.appendChild(paraUpload3Attr)

    var uploadBtn1 = document.createElement('input')  // input element, text
    uploadBtn1.setAttribute('type', 'file')
    uploadBtn1.setAttribute('class', 'image-input')

    addNuggetForm.appendChild(paraUpload3)
    addNuggetForm.appendChild(uploadBtn1)

    // creates a text area for the description adn renders it to the form
    var paraDescription4 = document.createElement('P')
    var paraDescription4Attr = document.createTextNode('Description: ')
    paraDescription4.classList.add('formPara')
    paraDescription4.appendChild(paraDescription4Attr)

    var txtBoxDescription1 = document.createElement('textarea')
    txtBoxDescription1.setAttribute('class', 'description-text-area')
    txtBoxDescription1.setAttribute('rows', 8)
    txtBoxDescription1.setAttribute('cols', 80)
    txtBoxDescription1.setAttribute('name', 'description')
    txtBoxDescription1.classList.add('add-form-input')

    addNuggetForm.appendChild(paraDescription4)
    addNuggetForm.appendChild(txtBoxDescription1)

    // create the submitter input and renders it to the form
    var paraName = document.createElement('P')
    var paraNameAttr = document.createTextNode('Your name: ')
    paraName.classList.add('formPara')
    paraName.appendChild(paraNameAttr)

    var txtboxName = document.createElement('input')
    txtboxName.setAttribute('type', 'text')
    txtboxName.setAttribute('name', 'author')
    txtboxName.classList.add('add-form-input')

    addNuggetForm.appendChild(paraName)
    addNuggetForm.appendChild(txtboxName)

    var errorMessage = document.createElement('P')
    errorMessage.classList.add('err-message')

    addNuggetForm.appendChild(errorMessage)
    // create a div to append buttons (check/cross) to it to have moe control over them on the form tab
    var buttonsContainer = document.createElement('div')
    buttonsContainer.classList.add('add-form-buttons')

    // creates the cross button
    var timesCircleButton = document.createElement('i')
    timesCircleButton.setAttribute('class', 'fa fa-times-circle fa-3x add-form-times')
    timesCircleButton.setAttribute('aria-hidden', 'true')
    timesCircleButton.addEventListener('click', function (e) {
      setTimeout(function () {
        document.body.removeChild(newDiv)
      }, TAB_ANIMATION_DURATION)
      newDiv.classList.toggle('visible')
      locationSelectDisplay.classList.toggle('visible')
    })

    // creates the check button
    var checkCircleButton = document.createElement('i')
    checkCircleButton.setAttribute('class', 'fa fa-check-circle fa-3x add-form-check')
    checkCircleButton.setAttribute('aria-hidden', 'true')
    checkCircleButton.addEventListener('click', submitForm)

    // appends the buttons to the div then append the div to the form
    buttonsContainer.appendChild(checkCircleButton)
    buttonsContainer.appendChild(timesCircleButton)
    addNuggetForm.appendChild(buttonsContainer)

    // create a hidden input for the latitude
    var latInput = document.createElement('input')
    latInput.setAttribute('class', 'add-form-input')
    latInput.setAttribute('type', 'hidden')
    latInput.setAttribute('value', lat)
    latInput.setAttribute('name', 'lat')

    // create a hidden input for the longitude
    var lngInput = document.createElement('input')
    lngInput.setAttribute('class', 'add-form-input')
    lngInput.setAttribute('type', 'hidden')
    lngInput.setAttribute('value', lng)
    lngInput.setAttribute('name', 'long')

    var imgHiddenInput = document.createElement('input')
    imgHiddenInput.setAttribute('class', 'add-form-input')
    imgHiddenInput.setAttribute('type', 'hidden')
    imgHiddenInput.setAttribute('name', 'img_url')

    addNuggetForm.appendChild(latInput)
    addNuggetForm.appendChild(lngInput)
    addNuggetForm.appendChild(imgHiddenInput)

    var newDiv = document.createElement('div')
    newDiv.classList.add('slide-up-tab')
    newDiv.classList.add('add-nugget-tab')

    // Amazon AWS3
    uploadBtn1.onchange = function () {
      var files = uploadBtn1.files
      var file = files[0]
      if (file === null) {
        // should send the user that he didn't uplaod a file or it wasn't succeful
        return
      }
      getSignedRequest(file)
    }

    function getSignedRequest (file) {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', '/sign-s3?file-name=' + file.name + '&file-type=' + file.type)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText)
            uploadFile(file, response.signedRequest, response.url)
          } else {
            // should send the user a message saying that uplading the image wasn't succeful and try again
          }
        }
      }
      xhr.send()
    }

    function uploadFile (file, signedRequest, url) {
      var xhr = new XMLHttpRequest()
      xhr.open('PUT', signedRequest)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // adds the url to a hidden input in the form to send it to the server
            imgHiddenInput.value = url
          } else {
            // should send the user a message saying that uplading the image wasn't succeful and try again
          }
        }
      }
      xhr.send(file)
    }

    newDiv.appendChild(addNuggetForm)
    return newDiv
  }
})()
