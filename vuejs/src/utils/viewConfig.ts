import configDefaults from '@/data/configDefaults.json'

/**
 * Object Check
 */

function objectCheck(options: any) {
	const { obj, item, param, action, text } = options
	if (Object(obj) === obj) {
		if (action == 'push') {
			item[param].push(obj)
		}
		if (action == 'set') {
			item[param] = obj
		}
		console.log(`new${text}(): ${text} created`)
		return obj
	}
	else {
		console.log(`new${text}(): Could not create ${text}`)
		return null
	}
}

/**
 * String Check
 */

function stringCheck(options: any) {
	const { obj, item, param, action, text, special } = options
	if (obj.length > 0) {
		if (special == 'file') {
			console.log(`new${text}(): Could not create ${text}`)
			return null
		}
		if (action == 'push') {
			item[param].push(String(obj))
		}
		if (action == 'set') {
			item[param] = String(obj)
		}
		console.log(`new${text}(): ${text} created`)
		return obj
	}
	else {
		console.log(`new${text}(): Could not create ${text}`)
		return null
	}
}

/**
 * Int Check
 */

function intCheck(options: any) {
	var { obj, item, param, action, text, special } = options
	try {
		var result: any = Number(obj)
		if (special != null && special == 'array') {
			result = [result]
		}
		if (action == 'push') {
			item[param].push(result)
		}
		if (action == 'set') {
			item[param] = result
		}
		console.log(`new${text}(): ${text} created`)
		return result
	}
	catch (error) {
		console.log(`new${text}(): Could not create ${text}`)
		console.error(error)
		return null
	}
}

/**
 * Dash Config Object
 */

export class dashConfig {

	view: Array<any>

	constructor(view: Array<any> = []) {
		this.view = view
	}

	set newView (view: any) {
		objectCheck({
			obj: view,
			item: this,
			param: 'view',
			action: 'push',
			text: 'View'
		})
	}

}

/**
 * View Object
 */

export class dashView {

	settings: any
	gauges: Array<any>
	title: string
	disabled: boolean

	constructor(settings:any = {}, gauges: Array<any> = [], title: string = '', disabled: boolean = false) {
		this.settings = settings
		this.gauges = gauges
		this.title = title
		this.disabled = disabled
	}

	set newSettings (settings: any) {
		objectCheck({
			obj: settings,
			item: this,
			param: 'settings',
			action: 'set',
			text: 'Settings'
		})
	}

	set newGauge (gauge: any) {
		objectCheck({
			obj: gauge,
			item: this,
			param: 'gauges',
			action: 'push',
			text: 'Gauges'
		})
	}

}

/**
 * Settings Object
 */

export class dashSettings {

	background: string
	dynamic?: any
	alerts: Array<any>

	constructor(options: any = {
			background: configDefaults.background,
			dynamic: null,
			alerts: []
	}) {
		this.background = options.background || configDefaults.background
		this.dynamic = options.dynamic || null
		this.alerts = options.alerts || []
	}

	set newBackground (bg: any) {
		stringCheck({
			obj: bg,
			item: this,
			param: 'background',
			action: 'set',
			text: 'Background',
			special: 'file'
		})
	}

	set newDynamic(dynamic: any) {
		objectCheck({
			obj: dynamic,
			item: this,
			param: 'dynamic',
			action: 'set',
			text: 'Dynamic'
		})
	}

	set newAlert(alert: any) {
		objectCheck({
			obj: alert,
			item: this,
			param: 'alerts',
			action: 'push',
			text: 'Alert'
		})
	}

}

/**
 * Dynamic Object
 */

export class dashDynamic {

	dataIndex: number
	op: string
	value: number
	priority: number
	unit: string
	disabled: boolean

	constructor(options: any = {
			dataIndex: configDefaults.pid,
			op: '==',
			value: 0,
			priority: 0,
			unit: configDefaults.unit,
			disabled: false
	}) {
		this.dataIndex = options.dataIndex || configDefaults.pid
		this.op = options.op || '=='
		this.value = options.value || 0
		this.priority = options.priority || 0
		this.unit = options.unit || configDefaults.unit
		this.disabled = options.disabled || true
	}

}

/**
 * Alert Object
 */

export class dashAlert {

	dataIndex: number
	op: string
	value: number
	priority: number
	message: string
	unit: string

	constructor(options: any = {
		dataIndex: configDefaults.pid,
		op: '==',
		value: 0,
		priority: 0,
		message: '',
		unit: configDefaults.unit
	}) {
		this.dataIndex = options.dataIndex || configDefaults.pid
		this.op = options.op || '=='
		this.value = options.value || 0
		this.priority = options.priority || 0
		this.message = options.message || ''
		this.unit = options.unit || configDefaults.unit
	}

}

/**
 * Gauge Object
 */

export class dashGauge {

	module: string
	path: string
	args?: any
	dataIndex: Array<number>
	unit: string
	disabled: boolean

	constructor(options: any = {
		module: '',
		path: configDefaults.gauge,
		args: {},
		dataIndex: [configDefaults.pid],
		unit: configDefaults.unit,
		disabled: false
	}) {
		this.module = options.module || ''
		this.path = options.path || configDefaults.gauge,
		this.args = options.args || null,
		this.dataIndex = options.dataIndex || [configDefaults.pid]
		this.unit = options.unit || configDefaults.unit
		this.disabled = options.disabled || false
	}

	set newModule (module: string) {
		stringCheck({
			obj: module,
			item: this,
			param: 'module',
			action: 'set',
			text: 'Module'
		})
	}

	set newPath (path: string) {
		stringCheck({
			obj: path,
			item: this,
			param: 'path',
			action: 'set',
			text: 'Path',
			special: 'file'
		})
	}

	set newArgs (args: any) {
		objectCheck({
			obj: args,
			item: this,
			param: 'args',
			action: 'set',
			text: 'Args'
		})
	}

	set newDataIndex (index: number) {
		intCheck({
			obj: index,
			item: this,
			param: 'dataIndex',
			action: 'set',
			text: 'DataIndex',
			special: 'array'
		})
	}

	set newUnit (unit: string) {
		stringCheck({
			obj: unit,
			item: this,
			param: 'unit',
			action: 'set',
			text: 'Unit'
		})
	}

}

/**
 * Args Object
 */

export class dashArgs {

	themeConfig: number
	MinMax: Array<number>

	constructor(options: any = {
		themeConfig: 0,
		MinMax: [0, 0]
	}) {
		this.themeConfig = options.themeConfig || 0
		this.MinMax = options.MinMax || [0, 0]
	}

	set newMin (min: number) {
		try {
			this.MinMax[0] = Number(min)
			console.log('newMin(): Min created')
		}
		catch (error) {
			console.log('newMin(): Could not create min')
			console.error(error)
		}
	}

	set newMax (max: number) {
		try {
			this.MinMax[1] = Number(max)
			console.log('newMax(): Max created')
		}
		catch (error) {
			console.log('newMax(): Could not create max')
			console.error(error)
		}
	}

	get min() {
		return this.MinMax[0]
	}

	get max() {
		return this.MinMax[1]
	}

}

/**
 * Get Dash Object from JSON
 */

export function getDashObject(oldConfig: any) {
	var newConfig = new dashConfig()
	for (let view in oldConfig.view) {
		var gauges = []
		for (let gauge in oldConfig.view[view].gauges) {
			var curGauge = oldConfig.view[view].gauges[gauge]
			curGauge.args = new dashArgs(curGauge.args)
			gauges.push(new dashGauge(curGauge))
		}
		newConfig.newView = new dashView(
			new dashSettings(oldConfig.view[view].settings),
			gauges, oldConfig.view[view].title)
	}
	return newConfig
}