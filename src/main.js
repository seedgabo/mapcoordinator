// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify)
Vue.config.productionTip = false


// Mixins
Vue.mixin(require('./mixins/storage.js').default);


// Filters
Vue.filter('distance', function (value) {
  if (!value) return ''
  value = parseFloat(value.toString())
  if (value > 1000) {
    return (value / 1000).toFixed(1) + "Km";
  }
  return (value).toFixed(1) + "mts";
})


// Components
Vue.component('map-user-dialog', require("./components/dialogs/UserDialog.vue").default);
Vue.component('map-place-dialog', require("./components/dialogs/PlaceDialog.vue").default);
Vue.component('nearby-places-dialog', require("./components/dialogs/NearbyPlaces.vue").default);




new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
