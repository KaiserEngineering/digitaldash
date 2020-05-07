<template>
	<ion-page>
		<ion-main-header :title="title" />
		<ion-content>
			<ion-grid>
				<ion-row-col class="ion-text-center" type="mid-md">
					<ion-text :color="feedbackColor">{{ totalFeedbackText }}</ion-text>
				</ion-row-col>
				<ion-row-col type="mid-md">
					<ion-item no-padding>
						<ion-label>Operator</ion-label>
						<ion-select :selected-text="operator" @ionChange="eventOperatorSelect">
							<ion-select-option v-for="(item, key) in operators" :key="key" :value="key" :selected="key == operator">{{ item }}</ion-select-option>
						</ion-select>
					</ion-item>
					<ion-item no-padding :style="valueColor">
						<ion-label position="floating">Value</ion-label>
						<ion-input :value="valueText" @ionInput="valueCheck($event)"  />
					</ion-item>
					<ion-item v-if="alert" no-padding :style="messageColor">
						<ion-label position="floating">Message</ion-label>
						<ion-input :value="messageText" @ionInput="messageCheck($event)" />
					</ion-item>
					<ion-item no-padding>
						<ion-label>Priority</ion-label>
						<ion-select :selected-text="priority" @ionChange="eventPrioritySelect">
							<ion-select-option v-for="(item, index) in priorities" :key="index" :value="item" :selected="item == priority">{{ item }}</ion-select-option>
						</ion-select>
					</ion-item>
				</ion-row-col>
				<ion-row-col v-if="alert" type="mid-sm">
					<ion-button expand="block" @click="eventDeleteAlert()">
						<ion-icon slot="start" name="trash" />
						Delete Alert
					</ion-button>
				</ion-row-col>
			</ion-grid>
			<ion-fab vertical="bottom" horizontal="end" slot="fixed">
				<ion-fab-button @click="eventDone()">
					<ion-icon name="checkmark"></ion-icon>
				</ion-fab-button>
			</ion-fab>
		</ion-content>
	</ion-page>
</template>

<script lang='ts'>
import Vue from 'vue'
import configMixin from '@/mixins/configMixin'
import toastMixin from '@/mixins/toastMixin'
import operators from '@/data/operators.json'
import { configFunctions } from '@/utils/configFunctions'
import { dangerComp } from '@/utils/miscFunctions'

export default Vue.extend({
	/**
	 * State
	 */

	data() {

		const items: any = {}
		for (let key in operators) {
			let operatorKey = key as keyof typeof operators
			items[operatorKey] = `${key} (${operators[operatorKey]})`
		}

		return {
			title: this.$route.params.title || '',
			alert: this.$route.params.alert != null ? this.$route.params.alert : false,
			priority: 0,
			operator: '',
			feedbackText: '',
			valueFeedback: '',
			messageFeedback: '',
			valueText: '',
			messageText: '',
			gaugeMin: 0,
			gaugeMax: 0,
			valueDanger: false,
			messageDanger: false,
			operators: items,
			priorities: [1, 2, 3]
		}
	},

	/**
	 * Mixins
	 */

	mixins: [
		toastMixin,
		configMixin,
	],

	/**
	 * Created
	 */

	created() {
		const gauge = configFunctions.dummyCurGauge.bind(this)()
		this.gaugeMin = gauge.args.min
		this.gaugeMax = gauge.args.max
		if (this.alert) {
			const alert = configFunctions.dummyCurAlert.bind(this)()
			const alerts = configFunctions.dummyCurView.bind(this)().settings.alerts
			this.valueText = alert.value
			this.messageText = alert.message
			this.operator = alert.op
			this.priority = alert.priority + 1
			this.checkAlertPriorities(alert, alerts)
		}
		else {
			const view = configFunctions.dummyCurView.bind(this)()
			const dynamic = view.settings.dynamic
			this.valueText = dynamic.value
			this.operator = dynamic.op
			this.priority = dynamic.priority + 1
			this.checkViewPriorities(dynamic, this.$store.state.dummy_config)
		}
	},

	/**
	 * Computed
	 */

	computed: {

		/**
		 * Value Color
		 */

		valueColor() {
			return dangerComp(this.valueDanger)
		},

		/**
		 * Message Color
		 */

		messageColor() {
			return dangerComp(this.messageDanger)
		},

		/**
		 * Feedback Color
		 */

		feedbackColor() {
			return this.totalFeedbackText.length > 0 ? 'danger' : undefined
		},

		/**
		 * Total Feedback Text
		 */

		totalFeedbackText() {
			return this.messageFeedback + this.valueFeedback
		},

	},

	/**
	 * Methods
	 */

	methods: {

		/**
		 * Check Alert Priorities
		 */

		checkAlertPriorities(alert: any, alerts: Array<any>) {
			for (let i in alerts) {
				let index = Number(i)
				if (this.$store.state.cur_alert != index && alerts[index].priority == alert.priority) {
					const message = alerts[index].message.length > 15 ? `${alerts[index].message.substr(0, 13)}...` : alerts[index].message
					this.toastWarning(`Warning: Alert with message "${message}" has the same priority and could cause conflicts.`)
				}
			}
		},

		/**
		 * Check View Priorities
		 */

		checkViewPriorities(dynamic: any, config: any) {
			const views = config.view
			for (let i in views) {
				let index = Number(i)
				if (this.$store.state.cur_view != index && !views[index].settings.dynamic.disabled && views[index].settings.dynamic.priority == dynamic.priority) {
					const message = views[index].settings.title.length > 15 ? `${views[index].settings.title.substr(0, 13)}...` : views[index].settings.title
					this.toastWarning(`Warning: View with title "${message}" has the same priority and could cause conflicts.`)
				}
			}
		},

		/**
		 * Value Check
		 */

		valueCheck(event: any) {
			var message = ''
			this.valueText = event.target.value
			if (isNaN(this.valueText)) {
				message += 'Value must be a number. '
			}
			if (!isNaN(this.valueText) && Number(this.valueText) < this.gaugeMin) {
				message += `Value must be greater than or equal to ${this.gaugeMin}. `
			}
			if (!isNaN(this.valueText) && Number(this.valueText) > this.gaugeMax) {
				message += `Value must be less than or equal to ${this.gaugeMax}. `
			}
			if (!isNaN(this.valueText) && !(Number(this.valueText) < this.gaugeMin) && !(Number(this.valueText) > this.gaugeMax)) {
				this.valueDanger = false
				this.valueFeedback = ''
				return true
			}
			else {
				this.valueDanger = true
				this.valueFeedback = message
				return false
			}
		},

		/**
		 * Message Check
		 */

		messageCheck(event: any) {
			this.messageText = event.target.value
			if (this.messageText.length == 0) {
				this.messageDanger = true
				this.messageFeedback = 'Message is required. '
			}
			else {
				this.messageDanger = false
				this.messageFeedback = ''
			}
		},

		/**
		 * Event: operator select
		 */

		eventOperatorSelect(event: any) {
			this.operator = event.target.value
			const config = this.$store.state.dummy_config
			if (this.alert) {
				const alert = configFunctions.configCurAlert.bind(this)(config)
				alert.op = this.operator
				configFunctions.updateDummy.bind(this)(config)
			}
			else {
				return
			}
		},

		/**
		 * Event: priority select
		 */

		eventPrioritySelect(event: any) {
			this.priority = event.target.value
			const config = this.$store.state.dummy_config
			if (this.alert) {
				const view = configFunctions.configCurView.bind(this)(config)
				const alert = configFunctions.configCurAlert.bind(this)(config)
				const alerts = view.settings.alerts
				alert.priority = Number(this.priority) - 1
				configFunctions.updateDummy.bind(this)(config)
				this.checkAlertPriorities(alert, alerts)
			}
			else {
				const view = configFunctions.configCurView.bind(this)(config)
				view.settings.dynamic.priority = Number(this.priority) - 1
				configFunctions.updateDummy.bind(this)(config)
				this.checkViewPriorities(view.settings.dynamic, config)
			}
		},

		/**
		 * Event: delete alert
		 */

		eventDeleteAlert() {
			const config = this.$store.state.dummy_config
			const view = configFunctions.configCurView.bind(this)(config)
			view.settings.alerts.splice(this.$store.state.cur_alert, 1)
			configFunctions.updateDummy.bind(this)(config)
			this.toastSuccessDelete('alert')
			this.$router.go(-1)
		},

		/**
		 * Event: done
		 */

		eventDone() {
			if (this.totalFeedbackText.length == 0) {
				const config = this.$store.state.dummy_config
				if (this.alert) {
					const alert = configFunctions.configCurAlert.bind(this)(config)
					alert.value = Number(this.valueText)
					alert.message = this.messageText
					configFunctions.updateDummy.bind(this)(config)
					this.toastPrimary('Alert updated')
				}
				else {
					const view = configFunctions.configCurView.bind(this)(config)
					const gauge = configFunctions.configCurGauge.bind(this)(config)
					view.settings.dynamic.value = Number(this.valueText)
					view.settings.dynamic.dataIndex = gauge.dataIndex[0]
					view.settings.dynamic.unit = gauge.unit
					view.settings.dynamic.disabled = false
					configFunctions.updateDummy.bind(this)(config)
					this.toastPrimary('Dynamic Parameter updated')
				}
				this.$router.go(-1)
			}
			else {
				return
			}
		},

	},
})
</script>