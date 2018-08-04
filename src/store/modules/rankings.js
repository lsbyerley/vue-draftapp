import Vue from 'vue'
import axios from 'axios'
import forEach from 'lodash/forEach'
import { insertPlayerNote, insertPlayerProjections } from '../../utils/util'

const rankings = {
	state: {
		isFetching: false,
		data: []
	},
	actions: {
		async getRankings({ commit, rootState }, payload) {
			commit('setFetchingRankings', { isFetching: true });

			try {
				const url = `https://jayzheng-ff-api.herokuapp.com/rankings?format=half_ppr`
				const res = await axios.get(url)

				console.time("Player Rankings: Adding Yahoo Player Key");
				let foundCount = 0
				let rankings = forEach(res.data.rankings, (ranking) => {

					if (ranking.name === 'Mitch Trubisky') //dumb name hack
						ranking.name = 'Mitchell Trubisky'

					let regex = RegExp(`${ranking.name}.*`,`i`)
					forEach(rootState.playerPool.data, (yPlayer) => {
						const yPlayerName = yPlayer.name
						let found

						if (ranking.position === 'DST') {
							regex = RegExp(`${yPlayerName}.*`,`i`)
							found = regex.test(ranking.name)
						} else{
							found = regex.test(yPlayerName);
						}

						if (found && (ranking.position === yPlayer.position || ranking.position === 'DST')) {
							foundCount += 1
							ranking.yahooPlayerKey = yPlayer.player_key
							ranking.team = yPlayer.team
							ranking = insertPlayerNote(ranking)
							ranking = insertPlayerProjections(ranking, rootState.projections.data)
							return false;
						}
					})

				})
				console.log('found count:'+foundCount)
				console.timeEnd("Player Rankings: Adding Yahoo Player Key");

				commit('setRankings', { rankings: rankings });
				commit('setFetchingRankings', { isFetching: false });
			} catch (err) {
				console.error(err);
				commit('setFetchingRankings', { isFetching: false });
				if (err.response && err.response.status === 401) {
					commit('setAuthModal', { open: true })
				}
			}
		}
	},
	mutations: {
		setRankings(state, payload) {
			Vue.set(state, 'data', payload.rankings)
		},
		setFetchingRankings(state, payload) {
			Vue.set(state, 'isFetching', payload.isFetching)
		},
	},
	getters: {
		rankingsByPos: (state) => (pos) => {
			if (state.data) {
				return state.data.filter((p) => {
					return p.position === pos
				})
			}
		}
	}
}

export default rankings
