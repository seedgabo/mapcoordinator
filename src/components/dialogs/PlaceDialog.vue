<template>
  <v-card>
    <v-card-title class="headline" primary-title> Lugar</v-card-title>
    <v-card-text>
      <v-text-field v-model="selectedPlace.name" label="Nombre"></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat @click="$emit('delete-place',selectedPlace)" color="red">Eliminar</v-btn>
      <v-btn flat @click="$emit('add-place',selectedPlace)" color="primary">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
	name: "PlaceDialog",
	props: {
		selectedPlace: {
			type: Object,
			default: function() {
				return {};
			}
		}
	}
};
</script>

