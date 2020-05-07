<template>
	<ion-page>
		<ion-main-header title="Edit View" :back="true" :save="true" @save="eventSave()" />
		<ion-content>
			<ion-row-col type="mid-lg">
				<ion-item no-padding>
					<ion-label position="floating">View Name</ion-label>
					<ion-input :value="viewTitle" @ionInput="viewTitle = $event.target.value" />
				</ion-item>
			</ion-row-col>
			<list-items :items="listItemsView" @toggle="eventToggleGauge($event)" @edit="eventEdit($event)" :key="listKey" />
			<ion-fab vertical="bottom" horizontal="end" slot="fixed">
				<ion-fab-button @click="eventNewGauge()">
					<ion-icon name="add"></ion-icon>
				</ion-fab-button>
			</ion-fab>
		</ion-content>
	</ion-page>
</template>

<script lang='ts'>
import Vue from 'vue'
import configMixin from '@/mixins/configMixin'
import toastMixin from '@/mixins/toastMixin'
import alertMixin from '@/mixins/alertMixin'
import imagePicker from '@/components/imagePicker.vue'
import { configFunctions } from '@/utils/configFunctions'
import {
	dashGauge,
	dashArgs,
} from '@/utils/viewConfig'

export default Vue.extend({

	/**
	 * State
	 */

	data() {
		return {
			viewTitle: configFunctions.liveCurView.bind(this)().title,
			addGaugeEnabled: true,
		}
	},

	/**
	 * Mixins
	 */

	mixins: [
		configMixin,
		toastMixin,
		alertMixin,
	],

	/**
	 * Created
	 */

	created() {
		this.insertBackground()
		for (let index in configFunctions.dummyCurView.bind(this)().gauges) {
			this.insertGauge({
				index: index,
				itemIndex: index,
			})
		}
		this.insertAllBackgrounds()
	},

	/**
	 * Methods
	 */

	methods: {

		/**
		 * Event: Save
		 */

		async eventSave() {
			const config = this.$store.state.dummy_config
			const view = configFunctions.configCurView.bind(this)(config)
			view.title = this.viewTitle
			configFunctions.updateDummy.bind(this)(config)
			configFunctions.syncConfigs.bind(this)('live')
			this.$store.dispatch('setData', {
				live_config: this.$store.state.live_config
			})
			this.eventBack(view.title)
		},

		/**
		 * Event: Edit
		 */

		async eventEdit(item: any) {
			if (item.type == 'gauge') {
				configFunctions.setCurGauge.bind(this)(item.index - 1)
				this.$router.push({ name: 'gauge' })
			}
			else if (item.type == 'background') {
				const modal = await this.$ionic.modalController.create({
					component: imagePicker,
					componentProps: {
						propsData: {
							items: this.backgroundItems,
							title: 'Background',
						}
					}
				})
				await modal.present()
				const res = await modal.onDidDismiss()
				this.eventBackgroundSelect(res.data)
			}
		},

		/**
		 * Event: New Gauge
		 */

		eventNewGauge() {
			const config = this.$store.state.dummy_config
			if (configFunctions.dummyCurView.bind(this)().gauges.length < 3) {
				config.view[this.$store.state.cur_view].newGauge = new dashGauge({ args: new dashArgs() })
				configFunctions.updateDummy.bind(this)(config)
				configFunctions.setCurGauge.bind(this)(configFunctions.dummyCurView.bind(this)().gauges.length - 1)
				this.insertGauge({
					index: this.$store.state.cur_gauge,
					itemIndex: this.$store.state.cur_gauge,
				})
				this.toastSuccessCreate(`Gauge ${this.$store.state.cur_gauge + 1}`)
			}
			else {
				this.toastWarningCreate('gauge')
			}
		},

		/**
		 * Event: Toggle Gauge
		 */

		eventToggleGauge(event: any) {
			const index = Number(event.index) - 1
			const config = this.$store.state.dummy_config
			const view = configFunctions.configCurView.bind(this)(config)
			const gauge = view.gauges[index]
			var message: string = ''
			gauge.disabled = !event.value
			if (!gauge.disabled) {
				message = `Gauge ${index + 1} enabled`
			}
			else {
				message = `Gauge ${index + 1} disabled`
			}
			configFunctions.updateDummy.bind(this)(config)
			this.toastPrimary(message)
		},

		/**
		 * Event: Back
		 */

		async eventBack(title: string | undefined) {
			var args: any = {}
			if (title != null) {
				args = {
					message: `${title} updated successfully`,
					color: 'success'
				}
			}
			else {
				const res = await this.alertText({
					title: 'Discard Changes',
					message: 'Are you sure you want to discard your changes?'
				})
				if (!res) {
					return false
				}
			}
			this.$router.push({
				name: 'config',
				params: args,
			})
		},

		/**
		 * Event: background select
		 */

		eventBackgroundSelect(item: any) {
			const config = this.$store.state.dummy_config
			const view = configFunctions.configCurView.bind(this)(config)
			view.settings.background = item.imageSrc
			configFunctions.updateDummy.bind(this)(config)
			this.insertBackground({
				index: 0,
				pushItem: false,
			})
			this.listKey += 1
			this.toastPrimary(`Selected background: ${item.desc}`)
		}

	},
})
</script>