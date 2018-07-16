<template>
  <v-card>
    <v-card-title class="headline" primary-title> Usuario</v-card-title>
    <v-card-text>
      <v-text-field v-model="selectedUser.name" label="Nombre"></v-text-field>
      <v-text-field v-model="selectedUser.phone" label="Telefono"></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat @click="$emit('delete-user',selectedUser)" color="red">Eliminar</v-btn>
      <v-btn flat @click="$emit('add-user', selectedUser)" color="primary">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
	name: "UserDialog",
	props: {
		selectedUser: {
			type: Object,
			default: function() {
				return {};
			}
		}
	}
};
</script>
