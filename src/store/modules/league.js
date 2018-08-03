import Vue from 'vue'
import axios from 'axios'

const league = {
	state: {
		isFetching: false,
		meta: {},
		settings: {}
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
		}
	},
	getters: {

	}
}

export default league
