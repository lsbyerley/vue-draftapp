import Vue from 'vue'
import Vuex from 'vuex'

import draftResults from './modules/draftResults'
import league from './modules/league'
import news from './modules/news'
import playerPool from './modules/playerPool'
import projections from './modules/projections'
import rankings from './modules/rankings'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		leagueKey: '',
		appLoading: false,
		authModalOpen: false
	},
	actions: {

	},
	mutations: {
		setAuthModal(state, payload) {
			Vue.set(state, 'authModalOpen', payload.open)
		},
		setAppLoading(state, payload) {
			Vue.set(state, 'appLoading', payload.loading)
		}
	},
	getters: {

	},
	modules : {
    draftResults,
		league,
		news,
		playerPool,
		projections,
		rankings
  }
})

export default store
