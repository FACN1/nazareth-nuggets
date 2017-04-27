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
mapIcons.forEach(function(icon) {
  icon.addEventListener('click', function(e) {
    nuggetContainer.classList.toggle('not-visible');
    nuggetContainer.classList.toggle('visible');
    event.stopPropagation();
  })
})

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
