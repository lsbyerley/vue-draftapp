import Vue from 'vue'
import axios from 'axios'

const playerPool = {
	state: {
		isFetching: false,
		data:[]
	},
	actions: {
		async getPlayerPool({ commit }, payload) {
			commit('setFetchingPlayerPool', { isFetching: true })

			try {
				///api/players/update/25
				const res = await axios.get('/api/players')
				commit('setPlayerPool', { players: res.data })
				commit('setFetchingPlayerPool', { isFetching: false })
			} catch (err) {
				console.error(err)
				commit('setFetchingPlayerPool', { isFetching: false })
				if (err.response && err.response.status === 401) {
					commit('setAuthModal', { open: true })
				}
			}
		}
	},
	mutations: {
		setPlayerPool(state, payload) {
			Vue.set(state, 'data', payload.players)
		},
		setFetchingPlayerPool(state, payload) {
			Vue.set(state, 'isFetching', payload.isFetching)
		}
	},
	getters: {

	}
}

export default playerPool
