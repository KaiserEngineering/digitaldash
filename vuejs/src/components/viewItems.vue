<template>
	<ion-list lines="none">
		<ion-row-col
			type="mid-view"
			v-for="(view, viewIndex) in items"
			:key="viewIndex"
		>
			<ion-card class="view-card">
				<ion-card-header>
					<ion-card-title>{{ view.title }}</ion-card-title>
				</ion-card-header>
				<img :src="getBackgroundSrc(view.background)" />
				<img
					v-for="(gauge, gaugeIndex) in view.gauges"
					:key="gauge.key"
					:src="getGaugeSrc(gauge.value)"
					:class="getGaugeClass(gaugeIndex, view.gauges)"
				/>
				<ion-button fill="clear" class="view-button-l" no-margin @click="eventEdit(viewIndex)">
					<ion-icon name="create" />
				</ion-button>
				<ion-button fill="clear" class="view-button-r" no-margin @click="eventDelete(viewIndex)">
					<ion-icon name="trash" />
				</ion-button>
				<ion-toggle :class="getToggleClass" :checked="!view.disabled" @ionChange="eventToggle(viewIndex, $event)" />
			</ion-card>
		</ion-row-col>
	</ion-list>
</template>

<script lang='ts'>
import Vue from 'vue'
import { gaugePath, backgroundPath } from '@/utils/miscFunctions'

export default Vue.extend({

	/**
	 * Data
	 */

	data() {
		return {

		}
	},

	/**
	 * Props
	 */

	props: {
		items: {
			type: Array,
			default: [],
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
			return 'view-toggle'
		}

	},

	/**
	 * Methods
	 */

	methods: {

		/**
		 * Get Gauge Class
		 */

		getGaugeClass(index: number, items: any) {
			const count: number = items.length
			if (count <= 1) {
				return 'view-gauge-1'
			}
			else if (count > 1) {
				return `view-gauge-${count} view-gauge-${count}-${index}`
			}
		},

		/**
		 * Get Gauge Src
		 */

		getGaugeSrc(src: any) {
			if (src != null && src != '') {
				return gaugePath(src)
			}
			else {
				return src
			}
		},

		/**
		 * Get Background Src
		 */

		getBackgroundSrc(background: any) {
			if (background != null && background != '') {
				return backgroundPath(background)
			}
			else {
				return null
			}
		},

		/**
		 * Event: edit
		 */

		eventEdit(index: number) {
			this.$emit('edit', {
				index: index
			})
		},

		/**
		 * Event: delete
		 */

		eventDelete(index: number) {
			this.$emit('delete', {
				index: index
			})
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

	}
})

</script>

<style scoped>
	.view-card {
		margin-bottom: 0px;
	}
	.view-gauge-1 {
		width: 50%;
		position: absolute;
		transform: translateX(50.0%) translateY(-87.5%);
	}
	.view-gauge-2 {
		width: 45%;
		position: absolute;
	}
	.view-gauge-2-0 {
		transform: translateX(11.25%) translateY(-88.75%);
	}
	.view-gauge-2-1 {
		transform: translateX(111.25%) translateY(-88.75%);
	}
	.view-gauge-3 {
		width: 33.33%;
		position: absolute;
	}
	.view-gauge-3-0 {
		transform: translateX(5.56%) translateY(-116.67%);
	}
	.view-gauge-3-1 {
		transform: translateX(100%) translateY(-116.67%);
	}
	.view-gauge-3-2 {
		transform: translateX(194.94%) translateY(-116.67%);
	}
	.view-button-l {
		position: absolute;
		transform: translateY(-125%) translateX(15%);
	}
	.view-button-r {
		position: absolute;
		transform: translateY(-125%) translateX(90%);
	}
	.view-toggle {
		position: absolute;
		transform: translateY(-155%) translateX(205%);
	}
</style>