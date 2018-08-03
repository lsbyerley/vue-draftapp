import Vue from 'vue'
import axios from 'axios'

const projections = {
	state: {
		isFetching: false,
		data: []
	},
	actions: {
		async getProjections({ commit }, payload) {
			commit('setFetchingProjections', { isFetching: true });

			try {
				const res = await axios.get('/api/projections')
				commit('setProjections', { projections: res.data });
				commit('setFetchingProjections', { isFetching: false });

			} catch (err) {
				console.error(err);
				commit('setFetchingProjections', { isFetching: false });
			}
		}
	},
	mutations: {
		setProjections(state, payload) {
			Vue.set(state, 'data', payload.projections)
		},
		setFetchingProjections(state, payload) {
			Vue.set(state, 'isFetching', payload.isFetching)
		}
	},
	getters: {

	}
}

export default projections
