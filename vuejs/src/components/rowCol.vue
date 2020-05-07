<template>
	<ion-row>
		<ion-col
			:size-xs="xsWidth"
			:offset-xs="xsOffset"
			:size-md="mdWidth"
			:offset-md="mdOffset"
		>
			<slot />
		</ion-col>
	</ion-row>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({

	/**
	 * Data
	 */

	data() {
		const types: any = {
			'mid-sm': {
				xsWidth: 6,
				xsOffset: 3,
				mdWidth: 2,
				mdOffset: 5,
			},
			'mid-md': {
				xsWidth: 8,
				xsOffset: 2,
				mdWidth: 4,
				mdOffset: 4,
			},
			'mid-lg' : {
				xsWidth: 10,
				xsOffset: 1,
				mdWidth: 8,
				mdOffset: 2,
			},
			'mid-xl' : {
				xsWidth: 12,
				xsOffset: 0,
				mdWidth: 10,
				mdOffset: 1,
			},
			'mid-view' : {
				xsWidth: 12,
				xsOffset: 0,
				mdWidth: 6,
				mdOffset: 3,
			},
		}
		return {
			xsWidth: types[this.type].xsWidth,
			xsOffset: types[this.type].xsOffset,
			mdWidth: types[this.type].mdWidth,
			mdOffset: types[this.type].mdOffset,
		}
	},

	/**
	 * Props
	 */

	props: {
		type: {
			type: String,
			default: 'mid-sm'
		}
	}

})

</script>