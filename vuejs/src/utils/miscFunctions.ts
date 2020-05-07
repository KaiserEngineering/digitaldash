import imagePaths from '@/data/imagePaths.json'
import obdPids from '@/data/obdPids.json'
import colors from '@/data/colors.json'
import unitsData from '@/data/unitsData'
import { ListItem, ListInsertArgs, DeviceArgs } from '@/utils/miscTypes'
import camelCase from 'lodash.camelcase'
import startCase from 'lodash.startcase'

/**
 * Generate UUID
 */

function uuid() {
    return `${Math.random().toString(36).substr(2, 9)}${new Date().getTime().toString()}`
}

/**
 * Title Case
 */

export function titleCase(text: string) {
    return startCase(camelCase(text))
}

/**
 * Background Path
 */

export function backgroundPath(desc: string, python: boolean = false) {
    const descMain = desc as keyof typeof imagePaths.background
    const descAlt = desc as keyof typeof imagePaths.background_alt
    if (imagePaths.background[descMain] == null) {
        return undefined
    }
    else {
        if (!python) {
            return `images/Background/${imagePaths.background[descMain]}.png`
        }
        else if (python && imagePaths.background_alt[descAlt] == null) {
            return `static/imgs/Background/${imagePaths.background[descMain]}.png`
        }
        else if (python && imagePaths.background_alt[descAlt] != null) {
            return `static/imgs/Background/${imagePaths.background_alt[descAlt]}`
        }
    }
}

/**
 * Gauge Path
 */

export function gaugePath(desc: string, python: boolean = false) {
    const descMain = desc as keyof typeof imagePaths.gauge
    const descAlt = desc as keyof typeof imagePaths.gauge_alt
    if (imagePaths.gauge[descMain] == null) {
        return undefined
    }
    else {
        if (!python) {
            return `images/${imagePaths.gauge[descMain]}/gauge.png`
        }
        else if (python && imagePaths.gauge_alt[descAlt] == null) {
            return `static/imgs/${imagePaths.gauge[descMain]}/gauge.png`
        }
        else if (python && imagePaths.gauge_alt[descAlt] != null) {
            return `static/imgs/${imagePaths.gauge[descMain]}/gauge.png`
        }
    }
}

/**
 * Get OBD-PID info by PID
 */

export function getPidInfo(index: number) {
    for (let i in obdPids) {
        if (Number(index) == Number(parseInt(obdPids[i].PID, 16))) {
            return obdPids[i]
        }
    }
    return null
}

/**
 * Get Units
 */

export function getUnits(unitM: string, gauge: any) {
    const unit = unitM as keyof typeof unitsData
    const unitData = []
    var unitArray = []
    if (unitsData[unit] != null) {
        if (unitsData[unit].primary) {
            unitArray = [unitM, unitsData[unit].alt]
        }
        else {
            unitArray = [unitsData[unit].alt, unitM]
        }
    }
    else {
        unitArray = [(unitM != '') ? gauge.unit : 'N/A']
    }
    for (let index in unitArray) {
        let item = unitArray[Number(index)]
        unitData.push({
            name: Number(index),
            type: 'radio',
            label: item,
            value: item,
            checked: item == unit,
        })
    }
    return unitData
}

/**
 * Insert List Item
 */

export function insertListItem(args: ListItem, pushItem: boolean = true, indexAsKey: boolean = false, offset: number = 0) {
    args = {
        title: `${titleCase(args.type)} ${args.index == null ? 0 : args.index}`,
        ...args,
    }
    if (args.index == null) {
        args.index = 0
    }
    args.key = !indexAsKey ? `${args.type}-${uuid()}` : `${args.type}-${args.index}`
    if (pushItem) {
        this.listItemsView.push(args)
    }
    else {
        this.listItemsView[args.index] = {
            ...args,
            index: args.index - offset,
        }
    }
}

/**
 * Init List Insert Args
 */

export function initListInsertArgs(args: ListInsertArgs) {
    args = args || {}
    args = {
        ...args,
        index: args.index != null ? Number(args.index) : this.listItemsView.length,
        itemIndex: args.itemIndex != null ? Number(args.itemIndex) : 0,
        offset: args.offset != null ? Number(args.index) : 0,
        pushItem: args.pushItem == null ? true : args.pushItem,
        configType: args.configType || 'live',
        actionType: args.actionType || 'summary',
    }
    return args
}

/**
 * Sync Devices
 */

export function syncDevices(data: any = {}) {
    this.$store.dispatch('setState',
        {
            devices: {
                ...this.$store.state.devices,
                ...data.devices,
            },
            cur_device: this.$device.uuid || ''
        }
    )
    if (this.$store.state.devices[this.$device.uuid] == null || data.devices == null || data.devices[this.$device.uuid] == null) {
        const devArgs: DeviceArgs = {
            uuid: this.$device.uuid,
            serial: this.$device.serial,
            platform: this.$device.platform,
            model: this.$device.model,
            version: this.$device.version,
            manufacturer: this.$device.manufacturer,
            isVirtual: this.$device.isVirtual,
        }
        this.$store.dispatch('addDeviceState', devArgs)
    }
}

/**
 * Login Failure
 */

export function loginFailure(error: any) {
    console.error(error)
    this.feedbackDanger = true
    this.feedbackText = 'Could not login, please try again'
    this.emailDanger = this.passDanger = true
    this.toastDanger(this.feedbackText)
}

/**
 * Login Data Sync
 */

export async function loginDataSync(data: any, method: string) {
    const oldData = {logged_in: 1, update_timestamp: 0}

    if (method == 'email' || oldData.logged_in != null) {
        const dataUpdate: any = {
            uid: 1,//data.user.uid,
            logged_in: true,
            signin_method: 'email',//method,
            devices: this.$store.state.devices,
            cur_device: this.$store.state.cur_device,
        }
        if (oldData.update_timestamp >= this.$store.state.update_timestamp) {
            this.$store.dispatch('setData', {
                ...oldData,
                ...dataUpdate,
            })
        }
        else {
            this.$store.dispatch('setData', dataUpdate)
        }
        this.$router.push({
            name: 'config',
            params: {
                message: 'Logged in successfully',
                color: 'success',
            }
        })
    }
    else {
        this.$store.dispatch('setState', {
            uid: data.user.uid
        })
        this.$router.push({
            name: 'signup',
            params: {
                email: this.emailText,
                password: this.passwordText,
                method: method,
                message: 'Please enter info to complete signup',
            }
        })
    }
    this.emailDanger = this.passDanger = false
}

/**
 * Danger Computed Value
 */

export function dangerComp(value: boolean) {
    return value ? `--border-color: ${colors.danger};` : undefined
}