import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import find from 'lodash/find'
import concat from 'lodash/concat'
import orderBy from 'lodash/orderBy'
import forEach from 'lodash/forEach'

Vue.use(Vuex)

/*axios.interceptors.request.use((res) => {
	console.log(res)
	return res
}, (err) => {
	console.log(err.response.status)
	return err
})*/

const store = new Vuex.Store({
	state: {
		authModalOpen: false,
		news: {
			isFetching: false,
			data: []
		},
		league: {
			isFetching: false,
			meta: {},
			settings: {}
		},
		rankings: {
			isFetching: false,
			data: []
		},
		draftResults: {
			isFetching: false,
			draftStatus: '',
			totalPicks: 0,
			totalRounds: 0,
			overallPick: 0,
			currentRound: 0,
			currentPick: 0,
			data: []
		},
		playerPool: {
			isFetching: false,
			data:[]
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
				}
      }
    },
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
		},
		async getDraftResults({ commit, state }, payload) {
			commit('setFetchingLeague', { isFetching: true });
			commit('setFetchingDraftResults', { isFetching: true })

			try {
				const res = await axios.get('/api/draftresults')

				const draftResults = res.data.draft_results
				let resultsWithPick = []
				let totalPicks = draftResults.length
				let totalRounds = (totalPicks / state.league.settings.max_teams)
				let overallPick = 1
				let currentRound = 1
				let currentPick = 1

				console.time('Draft Results: Matching Player Keys')
				forEach(draftResults, (result, i) => {
					if (typeof result.player_key !== undefined) {

						let player = find(state.playerPool.data, (p) => {
							return result.player_key === p.player_key
						})
						if (player) {
							const resultWithPick = result
							resultWithPick.player = player
							resultsWithPick.push(resultWithPick)
							overallPick += 1
							currentRound = (draftResults[i+1] != null) ? draftResults[i+1].round : draftResults[i].round
							currentPick = (draftResults[i+1] != null) ? draftResults[i+1].pick : draftResults[i].pick
							currentPick = (currentPick % 12 === 0) ? 12 : (currentPick % 12)
						} else {
							//console.log('pick not found', result)
						}
					}
				})
				/*console.log('Total Picks', totalPicks)
				console.log('Total Rounds', totalRounds)
				console.log('Overall Pick', overallPick)
				console.log('Current Round', currentRound)*/
				console.timeEnd('Draft Results: Matching Player Keys')

				commit('setDraftResults', {
					results: resultsWithPick,
					draftStatus: res.data.draft_status,
					totalPicks,
					totalRounds,
					overallPick,
					currentRound,
					currentPick
				})
				commit('setFetchingDraftResults', { isFetching: false })

			} catch(err) {
				console.error(err)
				commit('setFetchingDraftResults', { isFetching: false })
				commit('setFetchingLeague', { isFetching: false });
				if (err.response && err.response.status === 401) {
					commit('setAuthModal', { open: true })
				}
			}
		},
		async getPlayerRankings({ commit, state }, payload) {
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
					forEach(state.playerPool.data, (yPlayer) => {
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
							return false;
						}
					})
				})
				console.log('found count:'+foundCount)
				console.timeEnd("Player Rankings: Adding Yahoo Player Key");

        commit('setPlayerRankings', { rankings: rankings });
        commit('setFetchingRankings', { isFetching: false });
      } catch (err) {
        console.error(err);
        commit('setFetchingRankings', { isFetching: false });
				if (err.response && err.response.status === 401) {
					commit('setAuthModal', { open: true })
				}
      }
    },
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
			Vue.set(state.news, 'data', payload.news)
		},
		setFetchingNews(state, payload) {
			Vue.set(state.news, 'isFetching', payload.isFetching)
		},
		setAuthModal(state, payload) {
			Vue.set(state, 'authModalOpen', payload.open)
		},
		setLeague(state, payload) {
			Vue.set(state.league, 'meta', payload.league.meta)
			Vue.set(state.league, 'settings', payload.league.settings)
		},
		setFetchingLeague(state, payload) {
      Vue.set(state.league, 'isFetching', payload.isFetching);
    },
		setPlayerRankings(state, payload) {
      Vue.set(state.rankings, 'data', payload.rankings)
    },
		setFetchingRankings(state, payload) {
			Vue.set(state.rankings, 'isFetching', payload.isFetching)
		},
		setDraftResults(state, payload) {
			Vue.set(state.draftResults, 'data', payload.results)
			Vue.set(state.draftResults, 'draftStatus', payload.draftStatus)
			Vue.set(state.draftResults, 'totalPicks', payload.totalPicks)
			Vue.set(state.draftResults, 'totalRounds', payload.totalRounds)
			Vue.set(state.draftResults, 'overallPick', payload.overallPick)
			Vue.set(state.draftResults, 'currentRound', payload.currentRound)
			Vue.set(state.draftResults, 'currentPick', payload.currentPick)
		},
		setFetchingDraftResults(state, payload) {
			Vue.set(state.draftResults, 'isFetching', payload.isFetching)
		},
		setPlayerPool(state, payload) {
			Vue.set(state.playerPool, 'data', payload.players)
		},
		setFetchingPlayerPool(state, payload) {
			Vue.set(state.playerPool, 'isFetching', payload.isFetching)
		},
	},
	getters: {
		rankingsByPos: (state) => (pos) => {
			return state.rankings.data.filter((p) => {
				return p.position === pos
			})
		}
	}
})

export default store
