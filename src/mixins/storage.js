export default {
  methods: {
    getDistanceFromLatLon(src, dest) {
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
    },
    getClosetsPoints(origin, points = [], limit = 3) {
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
    },
    getFurthersPoints(origin, points = [], limit = 3) {
      var results = getClosetsPoints(origin, points, false).reverse()
      if (limit) {
        return results.slice(limit);
      }
      return results;
    },

    getDynamicClosetsPoints(origin, points = [], limit = 3) {
      results = [];
      if (limit > 100) limit = 100;
      while (results.length < limit) {
        points = points.filter((p) => {
          return origin.lat != p.lat && origin.lon != p.lon
        });
        results.push(this.getClosetsPoints(origin, points, limit = 1))
        origin = results[results.length - 1]
      }
      return results;
    },


    // OSM CALLS
    getLatLongFromAddress(address, viewbox = null) {
      var adds = "";
      if (viewbox) {
        adds += `${viewbox[0][0], viewbox[0][1], viewbox[1][0], viewbox[1][1]}`
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

    },
    getAddressFromLatLng(lat, lon) {

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

    },
    getBestRoute(points) {
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
    },
    TravelingSalesmanResolution(points) {
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
    },

    boundsToViewbox(map) {
      var bounds = map.getBounds();
      return [bounds.getEast(), bounds.getSouth(), [bounds.getWest(), bounds.getNorth()]]
    },

    // Storage Data
    getplaces() {
      var places = localStorage.getItem('places')
      if (places) {
        var results = JSON.parse(places)
        results.forEach((r) => {
          r.assigned = null
        });
        return results;
      }
      return [];
    },
    saveplaces(places) {
      localStorage.setItem('places', JSON.stringify(places));
    },
    getusers() {
      var users = localStorage.getItem('users')
      if (users) {
        var results = JSON.parse(places)
        results.forEach((r) => {
          r.assigned = null
        });
        return results;
      }
      return [];
    },
    saveusers(users) {
      localStorage.setItem('users', JSON.stringify(users));
    },


    // VUE Logic
    getAvailablePoints(places) {
      return places.filter((p) => {
        return !p.assigned;
      })
    },
    addUser(userData) {
      var marker = L.marker(userData.latlng).addTo(this.map);
      marker.bindPopup(userData.name).openPopup();
      this.users[this.users.length] = userData;
      this.saveusers();
    },

    addPlace(placeData) {
      var marker = L.marker(placeData.latlng).addTo(this.map);
      marker.bindPopup(placeData.name).openPopup();
      this.places[this.places.length] = placeData;
      this.saveplaces();
    },

    selectAll(object = 'users') {
      this[object].forEach((o) => {
        o.selected = true
      })
      this['save' + object]();
    },

    deselectAll(object = 'users') {
      this[object].forEach((o) => {
        o.selected = false
      })
      this['save' + object]();
    }

  }
}
