<template>
  <v-card fill-height>
    <v-toolbar dark color="primary">
      <v-toolbar-title class="headline" primary-title>
        Selector
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click.native="$emit('cancel')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text style="height:100%">
      <v-layout>

        <v-flex sm6 mr-3>
          <v-layout>
            <v-flex xs11>
              <v-text-field append-icon="search" solo placeholder="Buscar Lugares" v-model="query_places"></v-text-field>
            </v-flex>
            <v-flex>
              <v-menu offset-y>
                <v-btn slot="activator" icon flat>
                  <v-icon> more_vert
                  </v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile @click="selectAll('places')">
                    <v-list-tile-title>Seleccionar Todos</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="DeselectAll('places')">
                    <v-list-tile-title>Limpiar Todos</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-flex>

          </v-layout>
          <v-list>
            <v-list-tile @click="empty()" v-for="place in filterBy(places,query_places)" :key="place.id">
              <v-list-tile-content @click.stop="select(place,'places')">
                <v-list-tile-title>{{ place.name }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-checkbox @click="select(place,'places')" :input-value="place._selected"></v-checkbox>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-flex>

        <v-flex sm6 ml-3>
          <v-layout>
            <v-flex xs11>
              <v-text-field append-icon="search" solo placeholder="Buscar Lugares" v-model="query_users"></v-text-field>
            </v-flex>
            <v-flex>
              <v-menu offset-y>
                <v-btn slot="activator" icon flat>
                  <v-icon> more_vert
                  </v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile @click="selectAll('users')">
                    <v-list-tile-title>Seleccionar Todos</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="DeselectAll('users')">
                    <v-list-tile-title>Limpiar Todos</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-flex>

          </v-layout>

          <v-list>
            <v-list-tile @click="empty()" v-for="user in filterBy(users,query_users)" :key="user.id">
              <v-list-tile-content @click.stop="select(user,'users')">
                <v-list-tile-title>{{ user.name }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-checkbox @click="select(user,'users')" :input-value="user._selected"></v-checkbox>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-flex>

      </v-layout>
    </v-card-text>

    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat @click="$emit('cancel')">Cancel</v-btn>
      <v-btn flat @click="prompt=true" color="primary">Ok</v-btn>
    </v-card-actions>

    <v-dialog v-model="prompt" width="300">
      <v-card>
        <v-card-text>
          <v-text-field v-model="places_qty" min="1" label="Cantidad de Puntos"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat small @click="prompt= false"> Cancelar </v-btn>
          <v-btn flat color="primary" @click="ready();prompt=false" :disabled="places_qty < 1" small>Enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import imex from "../mixins/imex.js";
export default {
	name: "PlaceUserSelector",
	mixins: [imex],
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
			var results = [];
			var places = this.selected_places;
			this.selected_users.forEach((u) => {
				var points = this.getDynamicClosetsPoints(u, places, this.places_qty);
				results.push({
					user: u,
					places: points
				});
				var disableds = points.map((p) => {
					return p.id;
				});
				places.filter((p) => {
					return disableds.indexOf(p.id) == -1;
				});
			});
			this.export(this.toCSV(this.prepareToCsv(results)));
			this.$emit("selected", data);
		},

		prepareToCsv(data) {
			var results = [];
			data.forEach((d) => {
				var row = {
					nombre: d.user.name
				};
				d.places.forEach((p, i) => {
					row["Punto #" + (i + 1)] = p.name;
				});
				results.push(row);
			});
			return results;
		},

		select(r, type = "users") {
			this.$set(r, "_selected", !r._selected);
			if (r._selected) {
				this["selected_" + type].push(r);
			} else {
				var i = this["selected_" + type].indexOf(r);
				this["selected_" + type].splice(i, 1);
			}
			console.log(this["selected_" + type]);
		},

		selectAll(type = "users") {
			this[type].forEach((r) => {
				this.$set(r, "_selected", true);
			});
			this["selected_" + type] = this[type].map((r) => {
				return r;
			});
		},
		deselectAll(type = "users") {
			this[type].forEach((r) => {
				this.$set(r, "_selected", false);
			});
			this["selected_" + type] = [];
		},

		empty() {}
	},
	data() {
		return {
			users: [],
			selected_users: [],
			query_users: "",
			places_qty: 3,
			places: [],
			selected_places: [],
			query_places: "",
			prompt: true
		};
	}
};
</script>
