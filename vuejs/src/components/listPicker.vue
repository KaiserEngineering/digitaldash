<template>
	<ion-page>
		<ion-main-header :title="title" />
		<ion-content>
			<ion-list lines="full">
				<ion-item button v-for="item in items" :key="item.key" @click="eventClick(item)">
					<ion-label>
						<h2>{{ item.title }}</h2>
						<h3>{{ item.desc }}</h3>
					</ion-label>
				</ion-item>
			</ion-list>
		</ion-content>
	</ion-page>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({

	/**
	 * Props
	 */

	props: {
		items: {
			type: Array,
			default: () => [],
		},
		title: {
			type: String,
			default: '',
		}
	},

	/**
	 * Methods
	 */

	methods: {

		/**
		 * Event: click
		 */

		eventClick(item: any) {
			this.$ionic.modalController.dismiss(item)
		},

	}

})
</script>