<template>
	<ion-page>
		<ion-main-header title="Edit Config" :back="true" :menu="true" />
		<ion-content>
			<view-items
				:items="listItemsView"
				@edit="eventEditView($event)"
				@delete="eventDeleteView($event)"
				@toggle="eventToggleView($event)"
			/>
			<ion-fab vertical="bottom" horizontal="end" slot="fixed">
				<ion-fab-button @click="eventNewView($event)">
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
import { configFunctions } from '@/utils/configFunctions'
import {
	dashConfig,
	dashView,
	dashSettings,
	dashDynamic,
  dashGauge,
	dashArgs,
	getDashObject,
} from '@/utils/viewConfig'

export default Vue.extend({

	/**
	 * State
	 */

	data() {
		return {

		}
	},

	/**
	 * Mixins
	 */

	mixins: [
		configMixin,
		toastMixin,
	],

	/**
	 * Created
	 */

	async created() {
		this.loadConfig()
		for (let index in this.$store.state.live_config.view) {
			this.insertView({ index: index })
		}
	},

	/**
	 * Methods
	 */

	methods: {

		/**
		 * Load Config
		 */

		loadConfig() {
			if (this.$store.state.live_config.view == null || this.$store.state.live_config.view.length == 0) {
				this.genNewView(new dashConfig())
			}
			else {
				this.genDash(this.$store.state.live_config)
			}
		},

		/**
		 * Generate New View
		 */

		genNewView(config: dashConfig) {
			config.newView = new dashView()
			const lastIndex = config.view.length - 1
			config.view[lastIndex].newSettings = new dashSettings({ dynamic: new dashDynamic() })
			config.view[lastIndex].newGauge = new dashGauge()
			config.view[lastIndex].title = `View ${lastIndex + 1}`
			config.view[lastIndex].gauges[config.view[lastIndex].gauges.length - 1].newArgs = new dashArgs()
			configFunctions.updateLive.bind(this)(config)
			configFunctions.syncConfigs.bind(this)('dummy')
			configFunctions.setCurView.bind(this)(lastIndex)
		},

		/**
		 * Generate Dash
		 */

		genDash(config: any) {
			config = getDashObject(config)
			configFunctions.updateLive.bind(this)(config)
			configFunctions.syncConfigs.bind(this)('dummy')
			configFunctions.setCurView.bind(this)(config.view.length - 1)
		},

		/**
		 * Event: new view
		 */

		eventNewView() {
			const config: any = this.$store.state.live_config
			if (config.view.length < 3) {
				this.genNewView(config)
				this.insertView({ index: config.view.length - 1 })
				this.toastSuccessCreate(`View ${this.$store.state.cur_view + 1}`)
			}
			else {
				this.toastWarningCreate('view')
			}
		},

		/**
		 * Event: delete view
		 */

		eventDeleteView(event: any) {
			const index = event.index
			const config = this.$store.state.live_config
			const viewTitle = config.view[index].title
			const defaultTitles = [
				'View 1',
				'View 2',
				'View 3'
			]
			if (config.view.length > 1) {
				config.view.splice(index, 1)
				this.listItemsView.splice(index, 1)
				for (let index in config.view) {
					if (defaultTitles.includes(config.view[index].title)) {
						config.view[index].title = `View ${Number(index) + 1}`
					}
					if (defaultTitles.includes(this.listItemsView[index].title)) {
						this.listItemsView[index].title = `View ${Number(index) + 1}`
					}
				}
				configFunctions.updateLive.bind(this)(config)
				configFunctions.syncConfigs.bind(this)('dummy')
				configFunctions.setCurView.bind(this)(config.view.length - 1)
				this.toastSuccessDelete(viewTitle)
			}
			else {
				this.toastWarningDelete(viewTitle)
			}
		},

		/**
		 * Event: edit view
		 */

		eventEditView(event: any) {
			configFunctions.setCurView.bind(this)(event.index)
			this.$router.push({ name: 'view' })
		},

		/**
		 * Event: view toggle
		 */

		eventToggleView(event: any) {
			const config = this.$store.state.live_config
			const view = config.view[event.index]
			var message: string = ''
			view.disabled = !event.value
			if (!view.disabled) {
				message = `${view.title} enabled`
			}
			else {
				message = `${view.title} disabled`
			}
			configFunctions.updateLive.bind(this)(config)
			this.toastPrimary(message)
		},

	},
})
</script>