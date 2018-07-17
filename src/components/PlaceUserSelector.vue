<template>
  <v-card>
    <v-card-title class="headline" primary-title>
      Selector
    </v-card-title>
    <v-card-text>
      <v-layout>

        <v-flex sm6>
          <v-text-field solo v-model="query_places"></v-text-field>
          <v-list>
            <v-list-tile v-for="place in filterBy(places,query_places)" :key="place.id">
              <v-list-tile-content>
                <v-list-tile-title>{{ place.name }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-checkbox v-model="place._selected"></v-checkbox>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-flex>

        <v-flex sm6>
          <v-text-field solo v-model="query_users"></v-text-field>
          <v-list>
            <v-list-tile v-for="user in filterBy(users,query_users)" :key="user.id">
              <v-list-tile-content>
                <v-list-tile-title>{{ user.name }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-checkbox v-model="user._selected"></v-checkbox>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-flex>

      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat @click="$emit('cancel')">Cancel</v-btn>
      <v-btn flat @click="ready()" color="primary">Ok</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
	name: "PlaceUserSelector",
	mounted() {
		this.users = this.getusers();
		this.places = this.getplaces();
	},
	methods: {
		ready() {
			var data = {
				users: this.users.filter((u) => {
					return u._selected;
				}),
				places: this.places.filter((p) => {
					return p._selected;
				})
			};

			this.$emit("selected", data);
		}
	},
	data() {
		return {
			users: [],
			seleced_users: [],
			query_users: "",

			places: [],
			seleced_places: [],
			query_places: ""
		};
	}
};
</script>
