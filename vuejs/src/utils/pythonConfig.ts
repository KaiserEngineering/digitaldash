import { gaugePath, backgroundPath, getPidInfo } from './miscFunctions'

/**
 * Convert Config
 */

export function configConvert(obj: any) {
	const config: any = { view: [] }
	obj = JSON.parse(JSON.stringify(obj))
	for (const view in obj.view) {
		if (!obj.view[view].disabled) {
			const background = backgroundPath(obj.view[view].settings.background, true)
			const pids: Array<any> = []
			const gauges: Array<any> = []
			var dynamic: any = {}
			if (!obj.view[view].settings.dynamic.disabled) {
				dynamic = obj.view[view].settings.dynamic
				dynamic.dataIndex = pidUpdate(obj.view[view].settings.dynamic.dataIndex, pids)
			}
			var alerts = obj.view[view].settings.alerts
			for (let alert in obj.view[view].settings.alerts) {
				obj.view[view].settings.alerts[alert].dataIndex = pidUpdate(obj.view[view].settings.alerts[alert].dataIndex, pids)
			}
			for (let gauge in obj.view[view].gauges) {
				if (!obj.view[view].gauges[gauge].disabled) {
					const curGauge = obj.view[view].gauges[gauge]
					curGauge.dataIndex = pidUpdate(curGauge.dataIndex[0], pids)
					curGauge.path = gaugePath(curGauge.path, true)
					gauges.push(curGauge)
				}
			}
			config.view.push([
				{
					background: background,
					pids: pids,
				},
				{
					dynamic: dynamic,
					alerts: alerts,
				},
				gauges
			])
		}
	}
	return config
}

/**
 * PID Update
 */

function pidUpdate(pid: number, pids: Array<any>) {
	const pidInfo: any = getPidInfo(pid)
	var desc: string = ''
	if (pidInfo != null) {
		desc = pidInfo.Desc
	}
	if (!pids.includes(desc)) {
		pids.push(desc)
		return (pids.length - 1)
	}
	else {
		return pids.indexOf(desc)
	}
}