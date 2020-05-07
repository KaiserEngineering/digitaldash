import cloneDeep from 'lodash.clonedeep'

/**
 * Config Functions
 */

export const configFunctions = {

	/**
	 * Sync Configs
	 */

	syncConfigs(configType: string) {
		if (configType == 'dummy') {
			this.$store.dispatch(
				'setState',
				{
					dummy_config: cloneDeep(this.$store.state.live_config)
				}
			)
		}
		else {
			this.$store.dispatch(
				'setState',
				{
					live_config: cloneDeep(this.$store.state.dummy_config)
				}
			)
		}
	},

	/**
	 * Update Dummy
	 */

	updateDummy(config: any) {
		this.$store.dispatch(
			'setState',
			{ dummy_config: config }
		)
	},

	/**
	 * Update Live
	 */

	updateLive(config: any) {
		this.$store.dispatch(
			'setState',
			{ live_config: config }
		)
	},

	/**
	 * Live Config View
	 */

	liveView(index: number) {
		index = Number(index)
		return this.$store.state.live_config.view[index]
	},

	/**
	 * Live Config Current View
	 */

	liveCurView() {
		return this.$store.state.live_config.view[this.$store.state.cur_view]
	},

	/**
	 * Live Config Gauge
	 */

	liveGauge(index: number) {
		index = Number(index)
		return this.$store.state.live_config.view[this.$store.state.cur_view].gauges[index]
	},

	/**
	 * Live Config Current Gauge
	 */

	liveCurGauge() {
		return this.$store.state.live_config.view[this.$store.state.cur_view].gauges[this.$store.state.cur_gauge]
	},

	/**
	 * Live Config Alert
	 */

	liveAlert(index: number) {
		index = Number(index)
		return this.$store.state.live_config.view[this.$store.state.cur_view].settings.alerts[index]
	},

	/**
	 * Live Config Current Alert
	 */

	liveCurAlert() {
		return this.$store.state.live_config.view[this.$store.state.cur_view].settings.alerts[this.$store.state.cur_alert]
	},

	/**
	 * Dummy Config View
	 */

	dummyView(index: number) {
		index = Number(index)
		return this.$store.state.dummy_config.view[index]
	},

	/**
	 * Dummy Config Current View
	 */

	dummyCurView() {
		return this.$store.state.dummy_config.view[this.$store.state.cur_view]
	},

	/**
	 * Dummy Config Gauge
	 */

	dummyGauge(index: number) {
		index = Number(index)
		return this.$store.state.dummy_config.view[this.$store.state.cur_view].gauges[index]
	},

	/**
	 * Dummy Config Current Gauge
	 */

	dummyCurGauge() {
		return this.$store.state.dummy_config.view[this.$store.state.cur_view].gauges[this.$store.state.cur_gauge]
	},

	/**
	 * Dummy Config Alert
	 */

	dummyAlert(index: number) {
		index = Number(index)
		return this.$store.state.dummy_config.view[this.$store.state.cur_view].settings.alerts[index]
	},

	/**
	 * Dummy Config Current Alert
	 */

	dummyCurAlert() {
		return this.$store.state.dummy_config.view[this.$store.state.cur_view].settings.alerts[this.$store.state.cur_alert]
	},

	/**
	 * Config View
	 */

	configView(config: any, index: number) {
		index = Number(index)
		return config.view[index]
	},

	/**
	 * Config Current View
	 */

	configCurView(config: any) {
		return config.view[this.$store.state.cur_view]
	},

	/**
	 * Config Gauge
	 */

	configGauge(config: any, index: number) {
		index = Number(index)
		return config.view[this.$store.state.cur_view].gauges[index]
	},

	/**
	 * Config Current Gauge
	 */

	configCurGauge(config: any) {
		return config.view[this.$store.state.cur_view].gauges[this.$store.state.cur_gauge]
	},

	/**
	 * Config Alert
	 */

	configAlert(config: any, index: number) {
		index = Number(index)
		return config.view[this.$store.state.cur_view].settings.alerts[index]
	},

	/**
	 * Config Current Alert
	 */

	configCurAlert(config: any) {
		return config.view[this.$store.state.cur_view].settings.alerts[this.$store.state.cur_alert]
	},

	// Set Current View

	setCurView(index: number) {
		index = Number(index)
		this.$store.dispatch('setState', { cur_view: index })
	},

	// Set Current Guage

	setCurGauge(index: number) {
		index = Number(index)
		this.$store.dispatch('setState', { cur_gauge: index })
	},

	// Set Current Alert

	setCurAlert(index: number) {
		index = Number(index)
		this.$store.dispatch('setState', { cur_alert: index })
	},

}