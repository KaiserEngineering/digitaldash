import omit from 'lodash.omit'

/**
 * Initial Store
 */

export const initStore: any = {
	uid: '',
	first_name: '',
	last_name: '',
	email: '',
	signin_method: 'email',
	signup_date: '',
	update_timestamp: '',
	logged_in: false,
	email_verified: false,
	bluetooth_config: {},
	devices: {},
	live_config: {},
	dummy_config: {},
	python_config: {},
	cur_view: 0,
	cur_gauge: 0,
	cur_alert: 0,
	cur_device: '',
	ble_uuid: '',
}

/**
 * Omit Store - keys to omit from persistent storage
 */

export const omitStore: any = [
	'uid',
	'dummy_config',
	'python_config',
	'cur_view',
	'cur_gauge',
	'cur_alert',
	'cur_device',
	'ble_uuid',
]

/**
 * Mutate function
 */

export function mutate(state: any, payload: any) {
	for (let key in payload) {
		if (state[key] != null) {
			state[key] = payload[key]
		}
	}
}

/**
 * Device State
 */

export async function deviceState(state: any, payload: any) {
	state.devices = state.devices || {}
	if (state.devices[payload.uuid] == null) {
		state.devices[payload.uuid] = omit(payload, ['uuid'])
	}
	else {
		state.devices[payload.uuid] = {
			...state.devices[payload.uuid],
			...omit(payload, ['uuid'])
		}
	}
}

/**
 * Bluetooth State
 */

export async function bluetoothState (state: any, payload: any) {
	state.bluetooth_config = {
		...state.bluetooth_config || {},
		...payload,
	}
}