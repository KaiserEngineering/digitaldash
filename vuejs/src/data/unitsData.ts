/**
 * Convert mi to km
 */

function kmConvTo(val: any) {
	return Number(val) / 1.60934
}

/**
 * Convert km to mi
 */

function miConvTo(val: any) {
	return Number(val) * 1.60934
}

/**
 * To integer
 */

function toInt(val: any) {
	return Number(parseFloat(val).toFixed(0))
}

/**
 * Units
 */

export default {
	C: {
		alt: 'F',
		primary: true,
		convTo(val: any) {
			return toInt((Number(val) * (9 / 5)) + 32)
		},
	},
	F: {
		alt: 'C',
		primary: false,
		convTo(val: any) {
			return toInt((Number(val) - 32) * (5 / 9))
		},
	},
	km: {
		alt: 'mi',
		primary: true,
		convTo(val: any) {
			return toInt(kmConvTo(val))
		},

	},
	mi: {
		alt: 'km',
		primary: false,
		convTo(val: any) {
			return toInt(miConvTo(val))
		},
	},
	'km/h': {
		alt: 'mi/h',
		primary: true,
		convTo(val: any) {
			return toInt(kmConvTo(val))
		},
	},
	'mi/h': {
		alt: 'km/h',
		primary: false,
		convTo(val: any) {
			return toInt(miConvTo(val))
		},
	},
	'kPa': {
		alt: 'psi',
		primary: true,
		convTo(val: any) {
			return toInt(val * 0.145038)
		},
	},
	'psi': {
		alt: 'kPa',
		primary: false,
		convTo(val: any) {
			return toInt(val / 0.145038)
		},
	}
}