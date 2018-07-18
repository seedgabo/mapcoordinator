export default {
  created() {
    this.users = this.getusers();
  },
  methods: {
    select(u) {
      this.center = [u.latlng.lat, u.latlng.lon];
      this.zoom = 13;
    },
    moveUser(ev, user) {
      var latlng = {
        lat: ev.target._latlng.lat,
        lon: ev.target._latlng.lng
      };
      user.latlng = latlng;
      this.saveusers(this.users);
    },
    addUserMode() {
      this.edition = "users";
      this.viewMode = "map"
    },

    getPointsFromUser(user) {
      this.nearbyPoints = this.getDynamicClosetsPoints(user, this.places);
      console.log(this.nearbyPoints);
      this.showNearbys = true;
    },
    addUser(user = null) {
      console.log(user);
      if (user) {
        this.selectedUser = user;
      }

      this.selectedUser = user;
      var prev = this.users.find((u) => {
        return u.id == this.selectedUser.id;
      });
      if (prev) {
        prev = this.selectedUser;
      } else {
        this.users.push(this.selectedUser);
      }
      this.selectedUser = {};
      this.edition = null;
      this.saveusers(this.users);
    },
    deleteUser(user = null) {
      if (user) {
        this.selectedUser = user;
      }
      var prev = this.users.findIndex((u) => {
        return u.id == this.selectedUser.id;
      });
      if (prev > -1) {
        this.users.splice(prev, 1);
      }
      this.selectedUser = {};
      this.saveusers(this.users);
    }
  },
  data() {
    return {
      users: [],
      selectedUser: {}
    };
  },
  computed: {
    editingUser: {
      get() {
        return this.selectedUser.id || this.selectedUser.name;
      },
      set(value) {
        if (!value) {
          this.selectedUser = {};
        }
        return null;
      }
    }
  }
};
