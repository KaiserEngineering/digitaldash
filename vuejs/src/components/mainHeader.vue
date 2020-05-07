<template>
	<ion-header>
		<ion-toolbar>
			<ion-title>{{ title }}</ion-title>
			<ion-buttons v-if="back" slot="start">
				<ion-button fill="clear" @click="eventBack()">
					<ion-icon name="arrow-back" />
				</ion-button>
			</ion-buttons>
			<ion-buttons v-if="save" slot="end">
				<ion-button fill="clear" @click="eventSave()">
					<ion-icon name="save" />
				</ion-button>
			</ion-buttons>
			<ion-buttons v-if="menu" slot="end">
				<ion-menu-button />
			</ion-buttons>
		</ion-toolbar>
	</ion-header>
</template>

<script lang='ts'>
import Vue from 'vue'
import alertMixin from '@/mixins/alertMixin'

export default Vue.extend({

	/**
	 * Data
	 */

	data() {
		return {

		}
	},

	/**
	 * Mixins
	 */

	mixins: [
		alertMixin,
	],

	/**
	 * Props
	 */

	props: {
		title: {
			type: String,
			default: '',
		},
		back: {
			type: Boolean,
			default: false,
		},
		save: {
			type: Boolean,
			default: false,
		},
		menu: {
			type: Boolean,
			default: false,
		}
	},

	/**
	 * Methods
	 */

	methods: {

		/**
		 * Event: back
		 */

		async eventBack() {
			var res: boolean = true
			if (this.$route.name == 'view') {
				res = await this.alertText({
					title: 'Discard changes?',
					message: 'Would you like to discard your changes?'
				})
			}
			if (res) {
				this.$router.go(-1)
			}
		},

		/**
		 * Event: save
		 */

		eventSave() {
			this.$emit('save')
		},

	},

})

</script>