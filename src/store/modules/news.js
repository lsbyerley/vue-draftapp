import Vue from 'vue'
import axios from 'axios'

const news = {
	state: {
		isFetching: false,
		data: []
	},
	actions: {
		async getNews({ commit }, payload) {
			commit('setFetchingNews', { isFetching: true });

			try {
				const res = await axios.get('/api/news')
				commit('setNews', { news: res.data.items });
				commit('setFetchingNews', { isFetching: false });

			} catch (err) {
				console.error(err);
				commit('setFetchingNews', { isFetching: false });
			}
		}
	},
	mutations: {
		setNews(state, payload) {
			Vue.set(state, 'data', payload.news)
		},
		setFetchingNews(state, payload) {
			Vue.set(state, 'isFetching', payload.isFetching)
		}
	},
	getters: {

	}
}

export default news
