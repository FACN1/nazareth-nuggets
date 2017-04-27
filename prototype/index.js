var addNuggetButton = document.querySelector('.add-nugget-button');
var map = document.querySelector('.map');
var mapIcons = document.querySelectorAll('.map-icon');
var nuggetContainer = document.querySelector('.nugget-container');
var addNuggetContainer = document.querySelector('.nugget-add-container');
var addPinCheckButton = document.querySelector('.add-pin-check');

// show location select screen when add button is clicked
addNuggetButton.addEventListener('click', function(e) {
  var locationSelect = document.querySelector('.location-select')
  locationSelect.classList.toggle('hidden');
  map.classList.toggle('faded');
})

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

 addPinCheckButton.addEventListener('click', function(e) {
  addNuggetContainer.classList.toggle('not-visible');
  addNuggetContainer.classList.toggle('visible');
  event.stopPropagation();
})
