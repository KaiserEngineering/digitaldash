/**
 * List Item
 */

export interface ListItem {
	[index: string]: string | number | boolean | Array<string> | undefined,
	type: string,
	key?: string,
	index?: number,
	itemIndex?: number,
	title?: string,
	desc?: string,
	gauges?: Array<any>,
	image?: string,
	imageSrc?: string,
	disabled?: boolean,
}

/**
 * List Insert Args
 */

export interface ListInsertArgs {
	[index: string]: string | number | boolean | undefined,
	index?: number,
	offset?: number,
	pushItem?: boolean,
	configType?: string,
	actionType?: string,
}

/**
 * Toast Args
 */

export interface ToastArgs {
	[index: string]: string | number | boolean | undefined,
	message: string,
	color: string,
	position: string,
	duration: number,
	showCloseButton: boolean,
}

/**
 * Alert Text Args
 */

export interface AlertTextArgs {
	[index: string]: string,
	title: string,
	message: string,
}

/**
 * Alert Radio Args
 */

export interface AlertRadioArgs {
	[index: string]: string | Array<any>,
	title: string,
	items: Array<any>,
}

/**
 * Device Args
 */

export interface DeviceArgs {
	[index: string]: string | boolean,
	uuid: string,
	serial: string,
	platform: string,
	model: string,
	version: string,
	manufacturer: string,
	isVirtual: boolean,
}