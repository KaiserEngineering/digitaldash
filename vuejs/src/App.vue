<template>
	<ion-app>
		<ion-main-menu />
		<ion-vue-router id="main-menu" />
	</ion-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	name: 'app',

	/**
	 * Created
	 */

	created() {
		if (this.$store.state.logged_in == null || !this.$store.state.logged_in) {
			this.$router.push({ name: 'auth' })
		}
	},
})
</script>