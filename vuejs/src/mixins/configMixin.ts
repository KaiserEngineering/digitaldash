import Vue from 'vue'
import imagePaths from '@/data/imagePaths.json'
import obdPids from '@/data/obdPids.json'
import operators from '@/data/operators.json'
import { ListInsertArgs, ListItem } from '@/utils/miscTypes'
import { configFunctions } from '@/utils/configFunctions'
import {
	insertListItem,
	initListInsertArgs,
	getPidInfo,
	gaugePath,
	titleCase,
	backgroundPath
} from '@/utils/miscFunctions'

export default Vue.extend({

	/**
	 * State
	 */

	data() {
		return {
			listKey: 0,
			listItemsView: [],
			backgroundItems: [],
			gaugeItems: [],
			pidItems: [],
			feedbackText: '',
		}
	},

	/**
	 * Methods
	 */

	methods: {

		/**
		 * Log Config
		 */

		logConfig(config: string | any) {
			if (config != null && typeof config == 'string' && config == 'live') {
				console.log('Live Config:')
				console.log(this.$store.state.live_config)
			}
			else if (config != null && typeof config == 'string' && config == 'dummy') {
				console.log('Default Config:')
				console.log(this.$store.state.dummy_config)
			}
			else if (typeof config == 'object') {
				console.log('Config Object:')
				console.log(config)
			}
		},

		/**
		 * Log Views
		 */

		logViews() {
			console.log('Views:')
			console.log(this.listItemsView)
		},

		/**
		 * Log List Items
		 */

		logListItems() {
			console.log('List Items:')
			console.log(this.listItemsView)
		},

		/**
		 * Insert View
		 */

		insertView(args: ListInsertArgs) {
			args = initListInsertArgs.bind(this)(args)
			var view: any = null
			const index: number = args.index != null ? Number(args.index) : 0
			const itemArgs: ListItem = {
				type: 'view',
				index: index,
				gauges: []
			}
			if (args.configType == 'live') {
				view = configFunctions.liveView.bind(this)(index)
			}
			else if (args.configType == 'dummy') {
				view = configFunctions.dummyView.bind(this)(index)
			}
			itemArgs.title = view.title == '' ? `View ${this.listItemsView.length + 1}` : view.title
			for (let index in view.gauges) {
				if (itemArgs.gauges != null) {
					itemArgs.gauges.push({
						key: `gauge-${itemArgs.gauges.length}`,
						value: view.gauges[index].path
					})
				}
			}
			insertListItem.bind(this)(
				{
				...itemArgs,
				background: view.settings.background,
				disabled: view.disabled,
				},
				args.pushItem
			)
		},

		/**
		 * Insert Gauge
		 */

		insertGauge(args: ListInsertArgs) {
			args = initListInsertArgs.bind(this)(args)
			const view: any = configFunctions.dummyCurView.bind(this)()
			const index: number = args.index != null ? Number(args.index) : 0
			const itemIndex: number = args.itemIndex != null ? Number(args.itemIndex) : 0
			var itemArgs: ListItem = {
				type: 'gauge',
				index: index,
				title: `Gauge ${itemIndex + 1}`,
				image: gaugePath(view.gauges[itemIndex].path),
				imageSrc: view.gauges[itemIndex].path,
			}
			if (args.actionType == 'summary') {
				itemArgs = {
					...itemArgs,
					desc: getPidInfo(view.gauges[itemIndex].dataIndex[0])?.Desc,
					disabled: view.gauges[itemIndex].disabled,
				}
			}
			else if (args.actionType == 'edit') {
				itemArgs = {
					...itemArgs,
					desc: titleCase(view.gauges[itemIndex].path),
				}
			}
			insertListItem.bind(this)(itemArgs, args.pushItem)
		},

		/**
		 * Insert Background
		 */

		insertBackground(args: ListInsertArgs) {
			args = initListInsertArgs.bind(this)(args)
			const view: any = configFunctions.dummyCurView.bind(this)()
			const background = view.settings.background as keyof typeof imagePaths.background
			insertListItem.bind(this)(
				{
					type: 'background',
					title: 'Background',
					index: args.index,
					desc: titleCase(imagePaths.background[background]),
					image: backgroundPath(background),
					imageSrc: background,
				},
				args.pushItem
			)
		},

		/**
		 * Insert Parameter
		 */

		insertParameter(args: ListInsertArgs) {
			args = initListInsertArgs.bind(this)(args)
			insertListItem.bind(this)(
				{
					type: 'parameter',
					title: 'Parameter',
					index: args.index,
					desc: getPidInfo(configFunctions.dummyCurGauge.bind(this)().dataIndex[0])?.Desc,
				},
				args.pushItem
			)
		},

		/**
		 * Insert Unit
		 */

		insertUnit(args: ListInsertArgs) {
			args = initListInsertArgs.bind(this)(args)
			const unit: string = configFunctions.dummyCurGauge.bind(this)().unit
			insertListItem.bind(this)(
				{
					type: 'unit',
					index: args.index,
					title: 'Unit of Measurement',
					desc: unit != '' ? unit : 'N/A',
				},
				args.pushItem
			)
		},

		/**
		 * Insert Dynamic
		 */

		insertDynamic(args: ListInsertArgs) {
			args = initListInsertArgs.bind(this)(args)
			const dynamic = configFunctions.dummyCurView.bind(this)().settings.dynamic
			const gauge = configFunctions.dummyCurGauge.bind(this)()
			const isDynamic = dynamic.dataIndex == gauge.dataIndex[0]
			var disabled: boolean = false
			var desc: string = ''
			if (args.pushItem) {
				desc = dynamic.disabled || !isDynamic ? 'Disabled' : 'Enabled'
				disabled = dynamic.disabled || !isDynamic
			}
			else {
				desc = dynamic.disabled ? 'Disabled' : 'Enabled'
				disabled = dynamic.disabled
			}
			insertListItem.bind(this)(
				{
					type: 'dynamic',
					index: args.index,
					title: 'Dynamic Parameter',
					desc: desc,
					disabled: disabled,
				},
				args.pushItem
			)
		},

		/**
		 * Insert Dynamic Operator
		 */

		insertDynamicOperator(args: ListInsertArgs) {
			args = initListInsertArgs.bind(this)(args)
			const operator = configFunctions.dummyCurView.bind(this)().settings.dynamic.op as keyof typeof operators
			insertListItem.bind(this)(
				{
					type: 'dynamic-op',
					index: args.index,
					desc: `${operator} (${titleCase(operators[operator])})`
				},
				args.pushItem
			)
		},

		/**
		 * Insert Dynamic Value
		 */

		insertDynamicValue(args: ListInsertArgs) {
			args = initListInsertArgs.bind(this)(args)
			insertListItem.bind(this)(
				{
					type: 'dynamic-val',
					index: args.index,
					desc: configFunctions.dummyCurView.bind(this)().settings.dynamic.value,
				},
				args.pushItem
			)
		},

		/**
		 * Insert Alert
		 */

		insertAlert(args: ListInsertArgs) {
			args = initListInsertArgs.bind(this)(args)
			const alert = configFunctions.dummyCurAlert.bind(this)()
			const gauge = configFunctions.dummyCurGauge.bind(this)()
			const index: number = args.index != null ? Number(args.index) : 0
			const offset: number = args.offset != null ? Number(args.offset) : 0
			var title: string = ''
			if (args.pushItem) {
				title = `Alert ${index + 1}`
			}
			else {
				title = `Alert ${index - offset + 1}`
			}
			insertListItem.bind(this)(
				{
					type: 'alert',
					index: args.index,
					title: title,
					desc: `Parm. ${gauge.dataIndex[0]} ${alert.op} ${alert.value}`
				},
				args.pushItem,
				false,
				offset
			)
		},

		/**
		 * Insert Alert Operator
		 */

		insertAlertOperator(args: ListInsertArgs) {
			args = initListInsertArgs.bind(this)(args)
			const operator = configFunctions.dummyCurAlert.bind(this)().op as keyof typeof operators
			insertListItem.bind(this)(
				{
					type: 'alert-op',
					index: args.index,
					desc: `${operator} (${titleCase(operators[operator])})`
				},
				args.pushItem
			)
		},

		/**
		 * Insert Alert Value
		 */

		insertAlertValue(args: ListInsertArgs) {
			args = initListInsertArgs.bind(this)(args)
			insertListItem.bind(this)(
				{
					type: 'alert-val',
					index: args.index,
					desc: configFunctions.dummyCurAlert.bind(this)().value,
				},
				args.pushItem
			)
		},

		/**
		 * Insert Priority
		 */

		insertPriority(args: ListInsertArgs) {
			args = initListInsertArgs.bind(this)(args)
			insertListItem.bind(this)(
				{
					type: 'priority',
					index: args.index,
					desc: configFunctions.dummyCurAlert.bind(this)().priority,
				},
				args.pushItem
			)
		},

		/**
		 * Insert Message
		 */

		insertMessage(args: ListInsertArgs) {
			args = initListInsertArgs.bind(this)(args)
			const value = configFunctions.dummyCurAlert.bind(this)().message
			insertListItem.bind(this)(
				{
					type: 'message',
					index: args.index,
					desc: value != '' ? value : 'N/A',
				},
				args.pushItem
			)
		},

		/**
		 * Insert Device
		 */

		insertDevice(args: ListInsertArgs) {
			args = initListInsertArgs.bind(this)(args)
			const index: number = args.index != null ? Number(args.index) : 0
			insertListItem.bind(this)(
				{
					type: 'device',
					index: args.index,
					title: `Digital Dash ${index}`,
					desc: 'Device found. Not connected.',
				},
				args.pushItem
			)
		},

		/**
		 * Insert all PID's
		 */

		insertAllPids() {
			for (let index in obdPids) {
				let value = obdPids[index]
				if (!['C3', 'C4'].includes(value.PID)) {
					this.pidItems.push({
						key: `pid-${index}`,
						index: index,
						type: 'pid',
						title: value.Desc,
						desc: `PID #${Number(parseInt(value.PID, 16))}`,
						pid: parseInt(value.PID, 16)
					})
				}
			}
		},

		/**
		 * Insert all Gauges
		 */

		/**
		 * Insert all Gauges
		 */

		insertAllGauges() {
			const gaugeKeys = Object.keys(imagePaths.gauge)
			for (let index in gaugeKeys) {
				let key = gaugeKeys[index] as keyof typeof imagePaths.gauge
				this.gaugeItems.push({
					key: `gauge-${index}`,
					type: `gauge`,
					title: 'Gauge',
					desc: titleCase(imagePaths.gauge[key]),
					imagePath: gaugePath(key),
					imageSrc: key,
				})
			}
		},

		/**
		 * Insert all Backgrounds
		 */

		insertAllBackgrounds() {
			const backgroundKeys = Object.keys(imagePaths.background)
			for (let index in backgroundKeys) {
				let key = backgroundKeys[index] as keyof typeof imagePaths.background
				this.backgroundItems.push({
					key: `background-${index}`,
					type: `background`,
					title: 'Background',
					desc: titleCase(imagePaths.background[key]),
					imagePath: backgroundPath(key),
					imageSrc: key,
				})
			}
		},

	},
})