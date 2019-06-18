import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isCollapse: false,
    editableTabs: [],
    editableTabsValue: ''
  },
  mutations: {
    changeIscollapse(state) {
      state.isCollapse = !state.isCollapse
    },
    commitEditableTabs(state, params) {
      state.editableTabs = params.tabs
      state.editableTabsValue = params.editableTabsValue
    }
  },
  actions: {
    commitChangeIsCollapse({ commit }) {
      commit('changeIscollapse')
    }, 
    commitEditableTabs({ commit }, params) {
      commit('commitEditableTabs', params)
    }
  }
})
