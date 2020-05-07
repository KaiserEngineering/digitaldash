<template>
	<ion-list lines="full">
		<ion-item button v-for="(item, index) in items" :key="item.key" @click="eventClick(index, item)">
			<ion-thumbnail v-if="hasImage(item)" slot="start">
				<ion-img :src="item.image" />
			</ion-thumbnail>
			<ion-label>
				<h2>{{ item.title }}</h2>
				<h3>{{ item.desc }}</h3>
			</ion-label>
			<ion-toggle
				v-if="item.disabled != null"
				:checked="!item.disabled"
				@ionChange.stop="eventToggle(index, $event)"
			/>
		</ion-item>
	</ion-list>
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
			default: () => []
		}
	},

	/**
	 * Computed
	 */

	computed: {

		/**
		 * Get Toggle Class
		 */

		getToggleClass() {
			// TO-DO: fix toggle styles
			return
		},

	},

	/**
	 * Methods
	 */

	methods: {

		/**
		 * Has Image
		 */

		hasImage(item: any) {
			return item.image != null && item.image != ''
		},

		/**
		 * Event: toggle
		 */

		eventToggle(index: number, event: any) {
			this.$emit('toggle', {
				index: index,
				value: event.target.checked
			})
		},

		/**
		 * Event: click
		 */

		eventClick(index: number, item: any) {
			this.$emit('edit', {
				index: index,
				type: item.type
			})
		}

	},

})
</script>