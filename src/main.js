// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import Vuetify from "vuetify";
import Vue2Filters from "vue2-filters";
import "vuetify/dist/vuetify.min.css";
import storage from "./mixins/storage.js";

Vue.use(Vuetify);
Vue.use(Vue2Filters);
Vue.config.productionTip = false;

// Mixins
Vue.mixin(storage);

// Filters
Vue.filter("distance", function (value) {
  if (!value) return "";
  value = parseFloat(value.toString());
  if (value > 1000) {
    return (value / 1000).toFixed(1) + "Km";
  }
  return value.toFixed(1) + "mts";
});

// Components
Vue.component("map-user-dialog", require("./components/dialogs/UserDialog.vue").default);
Vue.component("map-place-dialog", require("./components/dialogs/PlaceDialog.vue").default);
Vue.component("nearby-places-dialog", require("./components/dialogs/NearbyPlaces.vue").default);
Vue.component("place-user-selector", require("./components/PlaceUserSelector.vue").default);

new Vue({
  el: "#app",
  router,
  components: {
    App
  },
  template: "<App/>"
});
