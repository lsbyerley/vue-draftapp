import Vue from 'vue'
import axios from 'axios'

const league = {
	state: {
		isFetching: false,
		errorFetching: false,
		meta: {},
		settings: {
			roster_positions: []
		}
	},
	actions: {
		async getLeague({ commit }, payload) {
			commit('setFetchingLeague', { isFetching: true });

			try {
				const url = `/api/league`;
				const res = await axios.get(url);
				commit('setLeague', { league: res.data });
				commit('setFetchingLeague', { isFetching: false });
			} catch (err) {
				console.error(err);
				commit('setFetchingLeague', { isFetching: false });
				if (err.response && err.response.status === 401) {
					commit('setAuthModal', { open: true })
				} else if (err.response && err.response.status === 500) {
					commit('setErrorFetching', { error: true })
				}
			}
		}
	},
	mutations: {
		setLeague(state, payload) {
			Vue.set(state, 'meta', payload.league.meta)
			Vue.set(state, 'settings', payload.league.settings)
		},
		setFetchingLeague(state, payload) {
			Vue.set(state, 'isFetching', payload.isFetching);
		},
		setErrorFetching(state, payload) {
			Vue.set(state, 'errorFetching', payload.error)
		}
	},
	getters: {

	}
}

export default league
