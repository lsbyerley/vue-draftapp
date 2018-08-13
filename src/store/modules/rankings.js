import Vue from 'vue'
import axios from 'axios'
import forEach from 'lodash/forEach'
import find from 'lodash/find'
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
				const url = '/api/rankings'
				const res = await axios.get(url)

				//TODO: NEED TO MAKE THIS FASTER
				console.time("Player Rankings: Adding Yahoo Player Key");
				let foundCount = 0
				let rankings = forEach(res.data, (ranking) => {

					if (ranking.name === 'Mitch Trubisky') //dumb name hack
						ranking.name = 'Mitchell Trubisky'

					let yPlayer = find(rootState.playerPool.data, (yp) => {
						const yPlayerName = yp.name
						let regexRank
						let foundRank
						let regexYahoo
						let foundYahoo

						regexRank = RegExp(`${ranking.name}.*`,`i`)
						foundRank = regexRank.test(yPlayerName)
						if (!foundRank) {
							regexYahoo = RegExp(`${yPlayerName}.*`,`i`)
							foundYahoo = regexYahoo.test(ranking.name)
						}

						return (foundRank || foundYahoo) && (ranking.position === yp.position || ranking.position === 'DST')
					})

					if (yPlayer) {
						foundCount += 1
						ranking.yahooPlayerKey = yPlayer.player_key
						ranking.yahooPlayerName = yPlayer.name
						ranking.team = yPlayer.team
						ranking = insertPlayerNote(ranking)
						ranking = insertPlayerProjections(ranking, rootState.projections.data)
					}

				})
				console.log('found count:'+foundCount, 'total rankings: '+rankings.length)
				forEach(rankings, (r) => {
					if (!r.yahooPlayerKey) {
						console.log(r.name)
					}
				})
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
