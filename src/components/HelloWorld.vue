<template>
  <v-container fluid fill-height pa-0>
    <v-slide-y-transition mode="out-in">
      <v-layout>
        <v-flex xs9 :class="{'edition-mode': edition }">
          <l-map @click="edition=false" ref="map" class="map" :zoom="zoom" :center="center">
            <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'></l-tile-layer>
            <l-marker :lat-lng="[user.latlng.lat,user.latlng.lon]" v-for="(user,index) in users" :key="index">
              <l-popup :content="user.name"> </l-popup>
            </l-marker>
          </l-map>
        </v-flex>
        <v-flex xs3 class="elevation-5">
          <v-list dense two-line subheader>
            <v-subheader inset class="primary--text"> Usuarios </v-subheader>
            <template v-for="(user,index) in users">
              <v-list-tile :key="index" avatar @click="select(user)">
                <v-list-tile-avatar>
                  <img src="https://www.inbenta.com/wp-content/themes/inbenta/img/icons/avatar.svg?ver=2">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-text="user.name"></v-list-tile-title>
                  <v-list-tile-sub-title v-text="user.phone"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">info</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider></v-divider>
            </template>
          </v-list>
          <v-btn @click="edition='users'" dark fab fixed bottom small right color="pink">
            <v-icon>add</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
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
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "vue2-leaflet";
export default {
	components: { LMap, LTileLayer, LMarker, LPopup, LTooltip },
	data() {
		return {
			users: [
				{
					id: 1,
					name: "Gabriel",
					phone: "304 6664147",
					latlng: { lat: 4.6710425, lon: -74.0480164 }
				}
			],
			center: [4.6710425, -74.0480164],
			zoom: 13,
			edition: false
		};
	},
	methods: {
		select(u) {
			this.center = [u.latlng.lat, u.latlng.lon];
			this.zoom = 13;
			console.log(u);
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
</style>
