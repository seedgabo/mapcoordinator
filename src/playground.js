function getDistanceFromLatLon(src, dest) {
  var R = 6371; // Radius of the earth in km
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  var dLat = deg2rad(dest.lat - src.lat); // deg2rad below
  var dLon = deg2rad(dest.lon - src.lon);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(src.lat)) * Math.cos(deg2rad(dest.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d * 1000; // distance in mts
}

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



// OSM CALLS
function getLatLongFromAddress(address, viewbox = null) {
  var adds = "";
  if (viewbox) {
    adds += `${viewbox[0][0],viewbox[0][1],viewbox[1][0],viewbox[1][1]}`
  }

  return new Promise((resolve, reject) => {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}${adds}`).then((response) => {
      if (response.status !== 200) {
        return reject(response.statusText)
      }
      response.json().then(function (data) {
        resolve(data)
      })
    })
  }).catch(reject)

}


function getAddressFromLatLng(lat, lon) {

  return new Promise((resolve, reject) => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`).then((response) => {
      if (response.status !== 200) {
        return reject(response.statusText)
      }
      response.json().then(function (data) {
        resolve(data)
      })
    })
  }).catch(reject)

}

function getBestRoute(points) {
  var coordinates = ""
  points.forEach((p) => {
    coordinates += `${points.lat},${points.lon};`
  });

  return new Promise((resolve, reject) => {
    fetch(`http://router.project-osrm.org/route/v1/driving/${coordinates}?annotations=true`).then((response) => {
      if (response.status !== 200) {
        return reject(response.statusText)
      }
      response.json().then((data) => {
        resolve(data)
      })
    });
  }).catch(reject)
}

function TravelingSalesmanResolution(points) {
  var coordinates = ""
  points.forEach((p) => {
    coordinates += `${points.lat},${points.lon};`
  });

  return new Promise((resolve, reject) => {
    fetch(`http://router.project-osrm.org/trip/v1/driving/${coordinates}?source=first&destination=last&annotations=true`).then((response) => {
      if (response.status !== 200) {
        return reject(response.statusText)
      }
      response.json().then((data) => {
        resolve(data)
      })
    });
  }).catch(reject)
}



//  MAP Functions
// https://github.com/KoRiGaN/Vue2Leaflet
//https://alertifyjs.com/

function boundsToViewbox(map) {
  var bounds = map.getBounds();
  return [bounds.getEast(), bounds.getSouth(), [bounds.getWest(), bounds.getNorth()]]
}

function createMap(id) {
  var map = L.map(id)
  map.locate({
    setView: true,
    maxZoom: 16
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  map.on('click', (ev) => {
    ev.latlng
  });
  return map;
}




// Storage Data
function getplaces() {
  var places = localStorage.getItem('places')
  if (places) {
    var results = JSON.parse(places)
    results.forEach((r) => {
      r.assigned = null
    });
    return results;
  }
  return [];
}

function saveplaces(places) {
  localStorage.setItem('places', JSON.stringify(places));
}

function getusers() {
  var users = localStorage.getItem('users')
  if (users) {
    var results = JSON.parse(places)
    results.forEach((r) => {
      r.assigned = null
    });
    return results;
  }
  return [];
}

function saveusers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}



// VUE Logic
function getAvailablePoints(places) {
  return places.filter((p) => {
    return !p.assigned;
  })
}


function addUser(userData) {
  var marker = L.marker(userData.latlng).addTo(this.map);
  marker.bindPopup(userData.name).openPopup();
  this.users[this.users.length] = userData;
  this.saveusers();
}

function addPlace(placeData) {
  var marker = L.marker(placeData.latlng).addTo(this.map);
  marker.bindPopup(placeData.name).openPopup();
  this.places[this.places.length] = placeData;
  this.saveplaces();
}

function selectAll(object = 'users') {
  this[object].forEach((o) => {
    o.selected = true
  })
  this['save' + object]();
}

function deselectAll(object = 'users') {
  this[object].forEach((o) => {
    o.selected = false
  })
  this['save' + object]();
}
