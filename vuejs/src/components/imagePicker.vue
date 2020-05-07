<template>
	<ion-page>
		<ion-main-header :title="title" />
		<ion-content>
			<ion-list lines="none" >
				<ion-item
					button
					v-for="(item, index) in items"
					:key="index"
					@click="eventClick(item)"
				>
					<ion-row-col type="mid-view">
						<ion-card class="view-card">
							<ion-card-header>
								<ion-card-subtitle>{{ item.desc }}</ion-card-subtitle>
							</ion-card-header>
							<img :src="item.imagePath" />
						</ion-card>
					</ion-row-col>
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