/* global L XMLHttpRequest */

(function () { // eslint-disable-line

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

  // commented out temporarily to prevent script error
  // Amazon S3
  // document.querySelector('.image-input').onchange = function () {
  //   var files = document.querySelector('.image-input').files
  //   var file = files[0]
  //   if (file === null) {
  //     // should send the user that he didn't uplaod a file or it wasn't succeful
  //     return
  //   }
  //   getSignedRequest(file)
  // }
  //
  // function getSignedRequest (file) {
  //   var xhr = new XMLHttpRequest()
  //   xhr.open('GET', '/sign-s3?file-name=' + file.name + '&file-type=' + file.type)
  //   xhr.onreadystatechange = function () {
  //     if (xhr.readyState === 4) {
  //       if (xhr.status === 200) {
  //         var response = JSON.parse(xhr.responseText)
  //         uploadFile(file, response.signedRequest, response.url)
  //       } else {
  //         // should send the user a message saying that uplading the image wasn't succeful and try again
  //       }
  //     }
  //   }
  //   xhr.send()
  // }
  //
  // function uploadFile (file, signedRequest, url) {
  //   var xhr = new XMLHttpRequest()
  //   xhr.open('PUT', signedRequest)
  //   xhr.onreadystatechange = function () {
  //     if (xhr.readyState === 4) {
  //       if (xhr.status === 200) {
  //         // adds the url to a hidden input in the form to send it to the server
  //         document.querySelector('.hidden-input-in-form').value = url
  //       } else {
  //         // should send the user a message saying that uplading the image wasn't succeful and try again
  //       }
  //     }
  //   }
  //   xhr.send(file)
  // }

  var locationSelectDisplay = document.querySelector('.location-select-display')
  var centerButton = document.querySelector('.center-button')
  centerButton.addEventListener('click', function (e) {
    mymap.locate({setView: true})
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
    txtBoxTitle1.classList.add('add-form-input')

    addNuggetForm.appendChild(paraTitle1)
    addNuggetForm.appendChild(txtBoxTitle1)

    // create category and its select then renders it to the form
    var paraCategory2 = document.createElement('P')
    var paraCategory2Attr = document.createTextNode('Category: ')
    paraCategory2.classList.add('formPara')
    paraCategory2.appendChild(paraCategory2Attr)

    var DropDownCategory = document.createElement('select') // input element, text
    DropDownCategory.setAttribute('name', 'DropDownCategoryName')
    DropDownCategory.classList.add('add-form-category-input')
    DropDownCategory.classList.add('add-form-input')

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

    // creates image input element and renders it to the form
    var paraUpload3 = document.createElement('P')
    var paraUpload3Attr = document.createTextNode('Upload Image: ')
    paraUpload3.classList.add('formPara')
    paraUpload3.appendChild(paraUpload3Attr)

    var uploadBtn1 = document.createElement('input')  // input element, text
    uploadBtn1.setAttribute('type', 'file')
    uploadBtn1.setAttribute('name', 'UploadBtnName')
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
    txtboxName.classList.add('add-form-input')

    addNuggetForm.appendChild(paraName)
    addNuggetForm.appendChild(txtboxName)

    // create a div to append buttons (check/cross) to it to have moe control over them on the form tab
    var buttonsContainer = document.createElement('div')
    buttonsContainer.classList.add('add-form-buttons')

    // creates the cross button
    var timesCircleButton = document.createElement('i')
    timesCircleButton.setAttribute('class', 'fa fa-times-circle fa-3x add-form-times')
    timesCircleButton.setAttribute('aria-hidden', 'true')

    // creates the check button
    var checkCircleButton = document.createElement('i')
    checkCircleButton.setAttribute('class', 'fa fa-check-circle fa-3x add-form-check')
    checkCircleButton.setAttribute('aria-hidden', 'true')

    // appends the buttons to the div then append the div to the form
    buttonsContainer.appendChild(checkCircleButton)
    buttonsContainer.appendChild(timesCircleButton)
    addNuggetForm.appendChild(buttonsContainer)

    // create a hidden input for the latitude
    var latInput = document.createElement('input')
    latInput.setAttribute('type', 'hidden')
    latInput.setAttribute('value', lat)

    // create a hidden input for the longitude
    var lngInput = document.createElement('input')
    lngInput.setAttribute('type', 'hidden')
    lngInput.setAttribute('value', lng)

    addNuggetForm.appendChild(latInput)
    addNuggetForm.appendChild(lngInput)

    var newDiv = document.createElement('div')
    newDiv.classList.add('slide-up-tab')
    newDiv.classList.add('add-nugget-tab')

    newDiv.appendChild(addNuggetForm)
    return newDiv
  }
})()
