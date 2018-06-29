function getClosetsPoints(origin, points = [], limit = 3) {
  var results = points.splice()
  results.forEach((p) => {
    p.distance = getDistanceFromLatLon(origin, p);
  });
  results = results.sort((a, b) => {
    return a.distance - b.distance
  })

  if (limit) {
    return results.slice(limit);
  }
  return results;
}

function getFurthersPoints(origin, points = [], limit = 3) {
  var results = getClosetsPoints(origin, points, false).reverse()
  if (limit) {
    return results.slice(limit);
  }
  return results;
}
