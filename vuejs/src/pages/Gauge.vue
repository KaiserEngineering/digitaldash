<template>
	<ion-page>
		<ion-main-header :title="pageTitle" :back="true" />
		<ion-content>
			<list-items :items="listItemsView" @toggle="eventToggleDynamic($event)" @edit="eventEdit($event)" :key="listKey" />
			<ion-row-col type="mid-sm">
				<ion-button expand="block" @click="eventDeleteGauge()">
					<ion-icon slot="start" name="trash" />
					Delete Gauge
				</ion-button>
			</ion-row-col>
			<ion-fab vertical="bottom" horizontal="end" slot="fixed">
				<ion-fab-button @click="eventNewAlert()">
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
import listPicker from '@/components/listPicker.vue'
import imagePicker from '@/components/imagePicker.vue'
import unitsData from '@/data/unitsData'
import { configFunctions } from '@/utils/configFunctions'
import { getPidInfo, getUnits } from '@/utils/miscFunctions'
import {
	dashAlert,
} from '@/utils/viewConfig'

export default Vue.extend({

	/**
	 * State
	 */

	data() {
		const gauge = configFunctions.dummyCurGauge.bind(this)()
		return {
			unitItems: getUnits(gauge.unit, gauge),
			pageTitle: `Edit Gauge ${this.$store.state.cur_gauge + 1}`,
			deleteEnabled: true,
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
		const view = configFunctions.dummyCurView.bind(this)()
		const gauge = configFunctions.dummyCurGauge.bind(this)()
		this.deleteEnabled = view.gauges.length > 1
		this.insertGauge({
			itemIndex: this.$store.state.cur_gauge,
			actionType: 'edit',
		})
		this.insertParameter()
		this.insertUnit()
		this.insertDynamic()
		for (let i in view.settings.alerts) {
			let index: number = Number(i)
			if (view.settings.alerts[index].dataIndex == gauge.dataIndex[0]) {
				configFunctions.setCurAlert.bind(this)(index)
				this.insertAlert({
					index: index,
				})
			}
		}
		this.insertAllGauges()
		this.insertAllPids()
	},

	/**
	 * Methods
	 */

	methods: {

		/**
		 * Reset Alerts
		 */

		resetAlerts(view: any, gauge: any) {
			for (let i in view.settings.alerts) {
				let index: number = Number(i)
				if (view.settings.alerts[index].dataIndex == gauge.dataIndex[0]) {
					configFunctions.setCurAlert.bind(this)(index)
					this.insertAlert({
						index: index + 4,
						offset: 4,
						pushItem: false
					})
				}
			}
		},

		/**
		 * Event: new alert
		 */

		eventNewAlert() {
			const config = this.$store.state.dummy_config
			const view = configFunctions.configCurView.bind(this)(config)
			var gauge = configFunctions.configCurGauge.bind(this)(config)
			if (view.settings.alerts.length < 3) {
				view.settings.alerts.push(new dashAlert({
					dataIndex: configFunctions.dummyCurGauge.bind(this)().dataIndex[0],
					unit: gauge.unit
				}))
				configFunctions.updateDummy.bind(this)(config)
				configFunctions.setCurAlert.bind(this)(view.settings.alerts.length - 1)
				this.insertAlert({ index: this.$store.state.cur_alert })
				this.toastSuccessCreate(`Alert ${this.$store.state.cur_alert + 1}`)
			}
			else {
				this.toastWarningCreate('alert')
			}
		},

		/**
		 * Event: edit item
		 */

		async eventEdit(item: any) {
			if (item.type == 'gauge') {
				const modal = await this.$ionic.modalController.create({
					component: imagePicker,
					componentProps: {
						propsData: {
							items: this.gaugeItems,
							title: 'Gauge',
						}
					}
				})
				await modal.present()
				const res = await modal.onDidDismiss()
				this.eventGaugeSelect(res.data)
			}
			else if (item.type == 'parameter') {
				const modal = await this.$ionic.modalController.create({
					component: listPicker,
					componentProps: {
						propsData: {
							items: this.pidItems,
							title: 'Parameters',
						}
					}
				})
				await modal.present()
				const res = await modal.onDidDismiss()
				this.eventPidSelect(res.data)
			}
			else if (item.type == 'unit') {
				const res = await this.alertRadio({
					title: 'Select Units',
					items: this.unitItems,
				})
				this.eventUnitSelect(res)
			}
			else if (item.type == 'dynamic') {
				this.$router.push({
					name: 'dynamic_parm',
					params: {
						title: 'Dynamic Parm.',
					}
				})
			}
			else if (item.type == 'alert') {
				const alertIndex = this.listItemsView[item.index].index
				configFunctions.setCurAlert.bind(this)(alertIndex)
				this.$router.push({
					name: 'alert',
					params: {
						title: `Alert ${this.$store.state.cur_alert + 1}`,
						alert: true,
					}
				})
			}
		},

		/**
		 * Event: gauge select
		 */

		eventGaugeSelect(item: any) {
			const config = this.$store.state.dummy_config
			const gauge = configFunctions.configCurGauge.bind(this)(config)
			gauge.path = item.imageSrc
			configFunctions.updateDummy.bind(this)(config)
			this.insertGauge({
				index: 0,
				itemIndex: this.$store.state.cur_gauge,
				actionType: 'edit',
				pushItem: false,
			})
			this.listKey += 1
			this.toastPrimary(`Selected gauge: ${item.desc}`)
		},

		/**
		 * Event: pid select
		 */

		eventPidSelect(item: any) {
			const config = this.$store.state.dummy_config
			const view = configFunctions.configCurView.bind(this)(config)
			const gauge = configFunctions.configCurGauge.bind(this)(config)
			const pidInfo = getPidInfo(item.pid)
			const newUnit = pidInfo != null ? pidInfo.Units : ''
			var hasAlerts = false
			var hasDynamic = false
			for (let i in view.settings.alerts) {
				let index = Number(i)
				if (view.settings.alerts[index].dataIndex == gauge.dataIndex[0]) {
					hasAlerts = true
					view.settings.alerts[index].dataIndex = item.pid
					view.settings.alerts[index].unit = newUnit
					if (view.settings.alerts[index].value < gauge.args.min || view.settings.alerts[index].value > gauge.args.max) {
						view.settings.alerts[index].value = gauge.args.min
					}
				}
			}
			if (view.settings.dynamic.dataIndex == gauge.dataIndex[0] && !view.settings.dynamic.disabled) {
				hasDynamic = true
				view.settings.dynamic.dataIndex = item.pid
				view.settings.dynamic.unit = newUnit
				if (view.settings.dynamic.value < gauge.args.min || view.settings.dynamic.value > gauge.args.max) {
					view.settings.dynamic.value = gauge.args.min
				}
			}
			gauge.dataIndex[0] = item.pid
			gauge.unit = newUnit
			gauge.args.newMin = pidInfo != null ? pidInfo.Min : 0
			gauge.args.newMax = pidInfo != null ? pidInfo.Max : 0
			this.unitItems = getUnits(gauge.unit, gauge)
			this.feedbackText = `PID #${gauge.dataIndex[0]} selected.`
			if (hasAlerts && (hasDynamic && !view.settings.dynamic.disabled)) {
				this.feedbackText += ' The Alerts shown below and the Dynamic Parameter may need to be updated.'
			}
			else if (hasAlerts && !(hasDynamic && !view.settings.dynamic.disabled)) {
				this.feedbackText += ' The Alerts shown below may need to be updated.'
			}
			else if (!hasAlerts && (hasDynamic && !view.settings.dynamic.disabled)) {
				this.feedbackText +=' The Dynamic Parameter may need to be updated.'
			}
			configFunctions.updateDummy.bind(this)(config)
			this.insertParameter({
				index: 1,
				pushItem: false,
			})
			this.insertUnit({
				index: 2,
				pushItem: false,
			})
			this.insertDynamic({
				index: 3,
				pushItem: false,
			})
			this.resetAlerts(view, gauge)
			this.listKey += 1
			this.toastPrimary(this.feedbackText)
		},

		/**
		 * Event: unit select
		 */

		eventUnitSelect(item: any) {
			const config = this.$store.state.dummy_config
			const view = configFunctions.configCurView.bind(this)(config)
			const gauge = configFunctions.configCurGauge.bind(this)(config)
			const newUnit = item.data.values != 'N/A' ? item.data.values : ''
			const unitConv = newUnit as keyof typeof unitsData
			for (let i in view.settings.alerts) {
				let index = Number(i)
				if (view.settings.alerts[index].unit == gauge.unit) {
					if (view.settings.alerts[index].unit != newUnit) {
						if (unitsData[unitConv] != null) {
							view.settings.alerts[index].value = unitsData[unitConv].convTo(view.settings.alerts[index].value)
						}
					}
					view.settings.alerts[index].unit = newUnit
				}
			}
			if (view.settings.dynamic.dataIndex == gauge.dataIndex[0] && view.settings.dynamic.unit == gauge.unit) {
				if (view.settings.dynamic.unit != newUnit) {
					if (unitsData[unitConv] != null) {
						view.settings.dynamic.value = unitsData[unitConv].convTo(view.settings.dynamic.value)
					}
				}
				view.settings.dynamic.unit = newUnit
			}
			if (gauge.unit != newUnit && unitsData[unitConv] != null) {
				if (unitsData[unitConv].primary) {
					gauge.args.newMin = getPidInfo(gauge.dataIndex[0])?.Min
					gauge.args.newMax = getPidInfo(gauge.dataIndex[0])?.Max
				}
				else {
					gauge.args.newMin = unitsData[unitConv].convTo(getPidInfo(gauge.dataIndex[0])?.Min)
					gauge.args.newMax = unitsData[unitConv].convTo(getPidInfo(gauge.dataIndex[0])?.Max)
				}
			}
			gauge.unit = newUnit
			configFunctions.updateDummy.bind(this)(config)
			this.unitItems = getUnits(gauge.unit, gauge)
			this.insertUnit({
				index: 2,
				pushItem: false
			})
			this.resetAlerts(view, gauge)
			this.listKey += 1
			this.toastPrimary(`Unit selected: ${item.data.values}`)
		},

		/**
		 * Event: toggle dynamic
		 */

		eventToggleDynamic(event: any) {
			const config = this.$store.state.dummy_config
			const view = configFunctions.configCurView.bind(this)(config)
			const gauge = configFunctions.configCurGauge.bind(this)(config)
			view.settings.dynamic.disabled = !event.value
			if (event.value) {
				view.settings.dynamic.dataIndex = gauge.dataIndex[0]
				view.settings.dynamic.unit = gauge.unit
			}
			const pidInfo = getPidInfo(gauge.dataIndex[0])
			const pidDesc = pidInfo != null ? pidInfo.Desc : ''
			if (!view.settings.dynamic.disabled) {
				this.feedbackText = `Dynamic Parameter enabled for PID# ${gauge.dataIndex[0]}: ${pidDesc}.`
				if (view.settings.dynamic.value < gauge.args.min || view.settings.dynamic.value > gauge.args.max) {
					view.settings.dynamic.value = gauge.args.min
					this.feedbackText += ' Dynamic value has changed, please edit accordingly.'
				}
			}
			else {
				this.feedbackText = `Dynamic Parameter disabled for PID# ${gauge.dataIndex[0]}: ${pidDesc}`
			}
			configFunctions.updateDummy.bind(this)(config)
			this.insertDynamic({
				index: 3,
				pushItem: false,
			})
			this.listKey += 1
			this.toastPrimary(this.feedbackText)
		},

		/**
		 * Event: Delete Gauge
		 */

		eventDeleteGauge() {
			const config = this.$store.state.dummy_config
			const view = configFunctions.configCurView.bind(this)(config)
			if (view.gauges.length > 1) {
				view.gauges.splice(this.$store.state.cur_gauge, 1)
				configFunctions.updateDummy.bind(this)(config)
				this.toastSuccessDelete('gauge')
				this.$router.go(-1)
			}
			else {
				this.toastWarningDelete('gauge')
			}
		},

	},
})
</script>