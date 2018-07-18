export default {
  created() {
    this.places = this.getplaces();
  },
  methods: {
    movePlace(ev, place) {
      var latlng = {
        lat: ev.target._latlng.lat,
        lon: ev.target._latlng.lng
      };
      place.latlng = latlng;
      this.saveplaces(this.places);
    },
    addPlaceMode() {
      this.edition = "places";
      this.viewMode = "map"
    },
    addPlace() {
      var prev = this.places.find((u) => {
        return u.id == this.selectedPlace.id;
      });
      if (prev) {
        prev = this.selectedPlace;
      } else {
        this.places.push(this.selectedPlace);
      }
      this.selectedPlace = {};
      this.edition = null;
      this.saveplaces(this.places);
    },
    deletePlace() {
      var prev = this.places.findIndex((u) => {
        return u.id == this.selectedPlace.id;
      });
      if (prev > -1) {
        this.places.splice(prev, 1);
      }
      this.selectedPlace = {};
      this.saveplaces(this.places);
    }
  },
  data() {
    return {
      places: [],
      selectedPlace: {},
      iconAddress: L.divIcon({
        className: "address-icon-container",
        html: "<div class='address-icon'></div>"
      }),

    }
  },
  computed: {
    editingPlace: {
      get() {
        return this.selectedPlace.id || this.selectedPlace.name;
      },
      set(value) {
        if (!value) {
          this.selectedPlace = {}
        }
        return null;
      }
    }
  }
}
