<template>
  <v-container fluid fill-height pa-0>
    <v-layout>
      <v-flex md2 xs12 :class="{'hidden-sm-and-down': viewMode !== 'places' }" class="elevation-5">
        <v-list dense>
          <v-subheader class="pink--text"> Lugares </v-subheader>
          <template v-for="place in places">
            <v-list-tile avatar @click="selectedPlace = place" :key="place.id">
              <v-list-tile-content>
                <v-list-tile-title v-text="place.name"></v-list-tile-title>
                <v-list-tile-sub-title v-text="place.phone"></v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon ripple @click.stop="selectedPlace = place">
                  <v-icon color="grey lighten-1">edit</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <!-- <v-divider :key="place.id +'-divider'"></v-divider> -->
          </template>
        </v-list>
        <v-btn @click="addPlaceMode()" dark fab fixed bottom small :right="$vuetify.breakpoint.smAndDown" :left="!$vuetify.breakpoint.smAndDown" color="success" class="">
          <v-icon>add</v-icon>
        </v-btn>
      </v-flex>

      <v-flex md8 xs12 sm12 :class="{'edition-mode': edition, 'hidden-sm-and-down': viewMode !== 'map' }">
        <l-map @click="clickMap" ref="map" class="map" :zoom="zoom" :center="center">
          <v-card class="search-map-input">
            <v-text-field @click.stop="showAddresses = true" v-model="searchQuery" @input="searchAddress" append-icon="search" placeholder="Buscar" solo></v-text-field>
            <v-list v-if="showAddresses">
              <small v-if="addresses.length === 0 && !searching" text-xs-center>
                No hay direcciones encontradas
              </small>
              <v-progress-linear v-if="searching" height="2" color="primary" indeterminate></v-progress-linear>
              <v-list-tile @click.stop="setAddress(address)" v-for="address in addresses" :key="address.osm_id">
                <v-list-tile-sub-title>
                  {{address.formatted_address}}
                </v-list-tile-sub-title>
              </v-list-tile>
            </v-list>
          </v-card>

          <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'></l-tile-layer>

          <l-marker draggable @moveend="moveUser($event,u)" :lat-lng="[u.latlng.lat,u.latlng.lon]" v-for="u in users" :key="u.id + '-marker'">
            <l-popup>
              <div text-center style="min-width:100px">
                <h3>
                  {{u.name}}
                </h3>
                <p>
                  {{u.phone}}
                </p>
              </div>
            </l-popup>
          </l-marker>

          <l-marker draggable @moveend="movePlace($event,place)" :lat-lng="[place.latlng.lat,place.latlng.lon]" v-for="(place,i) in places" :key="i" :icon="icon">
            <l-popup>
              <div text-center style="min-width:100px">
                <h3>
                  {{place.name}}
                </h3>
              </div>
            </l-popup>
          </l-marker>

          <l-marker :icon="iconAddress" :lat-lng="address.latlng" v-if="address">
            <l-popup>
              <v-menu offset-y>
                <div slot="activator" text-center style="min-width:100px">
                  <h3>
                    {{address.name}}
                  </h3>
                </div>
                <v-list>
                  <v-list-tile @click="createPersonInPoint(address)">
                    <v-list-tile-content>
                      Crear Persona Aqui
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile @click="createPlaceInPoint(address)">
                    <v-list-tile-content>
                      Crear Lugar Aqui
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </l-popup>
          </l-marker>

        </l-map>
      </v-flex>

      <v-flex md2 xs12 :class="{'hidden-sm-and-down': viewMode !== 'users' }" class="elevation-5">
        <v-list dense>
          <v-subheader class="primary--text"> Usuarios </v-subheader>
          <template v-for="user in users">
            <v-list-tile :key="user.id" avatar @click.stop="getPointsFromUser(user);select(user)">
              <v-list-tile-content>
                <v-list-tile-title v-text="user.name"></v-list-tile-title>
                <v-list-tile-sub-title v-text="user.phone"></v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon ripple @click.stop="selectedUser = user">
                  <v-icon color="grey lighten-1">edit</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <!-- <v-divider :key="user.id + '-divider'"></v-divider> -->
          </template>
        </v-list>
        <v-btn @click="addUserMode()" dark fab fixed bottom small right color="primary">
          <v-icon>add</v-icon>
        </v-btn>
      </v-flex>

      <v-btn class="hidden-md-and-up" fixed fab dark bottom left color="pink " small @click="changeViewMode() ">
        <v-icon v-if="viewMode=='map' ">place</v-icon>
        <v-icon v-if="viewMode=='places' ">people</v-icon>
        <v-icon v-if="viewMode=='users' ">map</v-icon>
      </v-btn>
    </v-layout>

    <v-dialog v-model="editingUser" width="500">
      <map-user-dialog v-if="selectedUser " v-on:add-user="addUser($event) " v-on:delete-user="deleteUser($event) " :selected-user="selectedUser "></map-user-dialog>
    </v-dialog>

    <v-dialog v-model="editingPlace" width="500">
      <map-place-dialog v-if="selectedPlace " v-on:add-place="addPlace($event) " v-on:delete-place="deletePlace($event) " :selected-place="selectedPlace "></map-place-dialog>
    </v-dialog>

    <v-dialog fullscreen hide-overlay transition="dialog-bottom-transition " scrollable v-model="showNearbys ">
      <nearby-places-dialog :places="nearbyPoints " v-on:close="showNearbys=false "></nearby-places-dialog>
    </v-dialog>

  </v-container>
</template>
<script>
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
	iconUrl: require("leaflet/dist/images/marker-icon.png"),
	shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip, LIconDefault } from "vue2-leaflet";
import mapusers from "../mixins/mapusers.js";
import mapplaces from "../mixins/mapplaces.js";
var debounce;
export default {
	mixins: [mapusers, mapplaces],
	components: { LMap, LTileLayer, LMarker, LPopup, LTooltip, LIconDefault },
	data() {
		return {
			icon: L.icon({
				iconUrl:
					"https://images.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn3.iconfinder.com%2Fdata%2Ficons%2Fshopping-and-market%2F512%2Fpin_marker_location_mark_navigation_flat_icon-512.png&f=1",
				iconSize: [33, 33]
			}),
			viewMode: "map",
			address: null,
			searchQuery: "",
			addresses: [],
			showAddresses: false,
			nearbyPoints: [],
			showNearbys: false,
			center: [4.6710425, -74.0480164],
			zoom: 12,
			edition: false,
			searching: false
		};
	},
	methods: {
		changeViewMode() {
			if (this.viewMode == "map") {
				return (this.viewMode = "users");
			}
			if (this.viewMode == "users") {
				return (this.viewMode = "places");
			}
			if (this.viewMode == "places") {
				return (this.viewMode = "map");
			}
		},
		clickMap(ev) {
			if (this.edition == "users") {
				var user = {
					id: this.users.length + 1,
					name: "",
					phone: "",
					latlng: { lat: ev.latlng.lat, lon: ev.latlng.lng }
				};
				this.selectedUser = user;
				this.$set(this, "selectedUser", user);
				this.edition = null;
			}
			if (this.edition == "places") {
				var place = {
					id: this.places.length + 1,
					name: "",
					latlng: { lat: ev.latlng.lat, lon: ev.latlng.lng }
				};
				this.selectedPlace = place;
				this.$set(this, "selectedPlace", place);
				this.edition = null;
			}
			this.showAddresses = false;
		},
		searchAddress() {
			clearTimeout(debounce);
			debounce = setTimeout(() => {
				if (this.searchQuery == "") {
					return;
				}
				this.searching = true;
				var bounds = this.$refs.map.mapObject.getBounds();
				this.getLatLongFromAddress(this.searchQuery, bounds)
					.then((resp) => {
						console.log(resp);
						this.searching = false;
						this.addresses = resp;
						this.showAddresses = true;
					})
					.catch((err) => {
						console.error(err);
						this.searching = false;
					});
			}, 2000);
		},
		setAddress(address) {
			this.address = {
				name: address.formatted_address,
				latlng: {
					lat: address.geometry.location.lat,
					lng: address.geometry.location.lng
				}
			};
			this.center = [address.geometry.location.lat, address.geometry.location.lng];
		},
		createPersonInPoint(ev) {
			var user = {
				id: this.users.length + 1,
				name: "",
				phone: "",
				latlng: { lat: ev.latlng.lat, lon: ev.latlng.lng }
			};
			this.selectedUser = user;
			this.$set(this, "selectedUser", user);
			this.edition = null;
		},
		createPlaceInPoint(ev) {
			var place = {
				id: this.places.length + 1,
				name: "",
				latlng: { lat: ev.latlng.lat, lon: ev.latlng.lng }
			};
			this.selectedPlace = place;
			this.$set(this, "selectedPlace", place);
			this.edition = null;
			this.showAddresses = false;
		}
	}
};
</script>
<style lang="stylus">
&.edition-mode {
  .vue2leaflet-map {
    cursor: crosshair;

    img {
      -webkit-filter: brightness(50%);
      filter: brightness(50%);
    }
  }
}

.search-map-input {
  z-index: 1000;
  width: 350px;

  @media (max-width: 600px) {
    width: 70%;
  }

  position: absolute;
  right: 15px;
  top: 10px;
}

.map {
  z-index: 1;
}

.address-icon {
  background-color: white;
  border-radius: 50px;
  height: 15px;
  width: 15px;
  border: 2px solid blue;
}
</style>
