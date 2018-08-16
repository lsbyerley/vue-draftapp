import Vue from 'vue'
import axios from 'axios'
import find from 'lodash/find'
import forEach from 'lodash/forEach'
import forOwn from 'lodash/forOwn'

const draftResults = {
	state: {
		isFetching: false,
		draftStatus: '',
		rosterSpots: 0,
		totalPicks: 0,
		totalRounds: 0,
		overallPick: 0,
		currentRound: 0,
		currentPick: 0,
		data: []
	},
	actions: {
		async getDraftResults({ commit, rootState }, payload) {
			commit('setFetchingLeague', { isFetching: true });
			commit('setFetchingDraftResults', { isFetching: true })

			try {
				const res = await axios.get('/api/draftresults')

				const draftResults = res.data.draft_results
				let rosterSpots = 0
				rootState.league.settings.roster_positions.forEach((pos) => {
					rosterSpots += pos.count
				})
				let totalTeams = parseInt(rootState.league.settings.max_teams)
				let resultsWithPick = []
				let totalPicks = rosterSpots * totalTeams
				let totalRounds = (totalPicks / totalTeams)
				let overallPick = 1
				let currentRound = 1
				let currentPick = 1

				console.time('Draft Results: Matching Player Keys')
				forEach(draftResults, (result, i) => {
					if (typeof result.player_key !== undefined) {
						let player = find(rootState.playerPool.data, (p) => {
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
						}
					}
				})
				/*console.log('Total Picks', totalPicks)
				console.log('Total Rounds', totalRounds)
				console.log('Overall Pick', overallPick)
				console.log('Current Round', currentRound)*/
				console.timeEnd('Draft Results: Matching Player Keys')

				commit('setDraftResults', {
					data: resultsWithPick,
					draftStatus: res.data.draft_status,
					rosterSpots,
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
				} else if (err.response && err.response.status === 500) {
					commit('setDraftResults', { draftStatus: 'postdraft' })
				}
			}
		}
	},
	mutations: {
		setDraftResults(state, payload) {
			forOwn(payload, (value, key) => {
				Vue.set(state, key, value)
			})
		},
		setFetchingDraftResults(state, payload) {
			Vue.set(state, 'isFetching', payload.isFetching)
		}
	},
	getters: {

	}
}

export default draftResults
