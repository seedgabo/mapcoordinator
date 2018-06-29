<template>
  <v-container fluid fill-height pa-0>
    <v-slide-y-transition mode="out-in">
      <v-layout>
        <v-flex xs9>
          <l-map ref="map" style="height:100%;width:100%" :zoom=13 :center="[4.6710425,-74.0480164]">
            <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'></l-tile-layer>
          </l-map>
        </v-flex>
        <v-flex xs3>
          <v-list dense two-line subheader>
            <v-subheader inset class="primary--text"> Usuarios </v-subheader>
            <template v-for="user in users">
              <v-list-tile :key="user.name" avatar @click="select(user)">
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
              <v-divider :key="user.name"></v-divider>
            </template>
          </v-list>
          <v-btn dark fab fixed bottom right color="pink">
            <v-icon>add</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>
<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
export default {
	components: { LMap, LTileLayer, LMarker },
	data() {
		return {
			users: [
				{
					id: 1,
					name: "Gabriel",
					phone: "304 6664147"
				}
			]
		};
	},
	methods: {
		select(u) {
			console.log(u);
		}
	}
};
</script>
<style scoped>
</style>
