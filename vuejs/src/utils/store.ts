import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import {
    initStore,
    mutate,
} from './storeDefinitions'
import omit from 'lodash.omit'
const vuexLocal = new VuexPersist({
    storage: window.localStorage,
    // reducer: (state: any) => omit(state, omitStore),
})

Vue.use(Vuex)

/**
 * Vuex Store
 */

export default new Vuex.Store({
  state: initStore,
  mutations: {
        mutateState(state: any, payload: any) {
            mutate(state, payload)
        },
        async mutateData(state: any, payload: any) {
            mutate(state, payload)
        },
        async setData(state: any, payload: any) {
            mutate(state, payload)
        },
        resetState(state: any) {
            mutate(state, initStore)
        },
  },
  actions: {
        setState(context: any, payload: any) {
            context.commit('mutateState', payload)
        },
        updateData(context: any, payload: any) {
            context.commit('mutateData', payload)
        },
        setData(context: any, payload: any) {
            context.commit('setData', payload)
        },
        resetState(context: any) {
            context.commit('resetState')
        },
        setBluetoothState(context: any, payload: any) {
            context.commit('mutateBluetoothState', payload)
        },
        updateBluetoothData(context: any, payload: any) {
            context.commit('mutateBluetoothData', payload)
        },
        addDeviceState(context: any, payload: any) {
            context.commit('addDevice', payload)
        },
        updateDeviceData(context: any, payload: any) {
            context.commit('mutateDeviceData', payload)
        },
    },
  plugins: [vuexLocal.plugin]
})
