<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" enable-resize-watcher temporary app>
      <v-list>
        <v-list-tile value="true" v-for="(item, i) in items" :key="i">
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app color="primary" dark>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn dark flat @click="programing=true">
        Programar
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view/>
      <v-dialog fullscreen hide-overlay transition="dialog-bottom-transition" scrollable v-model="programing">
        <place-user-dialog v-on:cancel="programing=false" v-on:selected="showData($event)"></place-user-dialog>
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
export default {
	data() {
		return {
			drawer: false,
			programing: false,
			items: [
				{
					icon: "bubble_chart",
					title: "Inspire"
				}
			],
			title: "Coordinator"
		};
	},
	methods: {
		showData($event, data) {
			this.programing = false;
			console.log(arguments);
		}
	},
	name: "App"
};
</script>
