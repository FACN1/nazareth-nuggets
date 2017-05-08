function generateMockNuggets (quantity, categories, bounds) {
  // produces an array of random mock nugget objects
  var nuggets = []
  var latBounds = [bounds[0][0], bounds[1][0]]
  var lngBounds = [bounds[0][1], bounds[1][1]]
  for (var i = 0; i < quantity; i++) {
    nuggets.push({
      id: i,
      category: categories[Math.floor(Math.random() * categories.length)],
      lat: latBounds[0] + (Math.random() * (latBounds[1] - latBounds[0])),
      long: lngBounds[0] + (Math.random() * (lngBounds[1] - lngBounds[0]))
    })
  }
  return nuggets
}
