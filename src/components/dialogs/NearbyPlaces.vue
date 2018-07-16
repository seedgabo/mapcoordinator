<template>
  <v-card>
    <v-card-title class="headline" primary-title>
      Lugares mas Cercanos
      <v-spacer></v-spacer>
      <v-btn flat icon @click="$emit('close')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-list>
        <v-list-tile v-for="(point,index) in places" :key="index">
          <v-list-tile-content>
            <v-list-tile-title>{{ point.name }}</v-list-tile-title>
            <v-list-tile-sub-title>{{point.distance | distance}}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat @click="$emit('close')" color="primary">Ok</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
	name: "NearbyPlaceDialog",
	props: {
		places: {
			type: Array,
			default: function() {
				return [];
			}
		}
	}
};
</script>
