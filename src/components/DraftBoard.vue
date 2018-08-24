<template>
	<div class="draftboard">
		<DraftStats />
		<div class='box'>

			<div class="columns">
				<div class="column is-9">
					<div class="columns">
						<div class="column is-1"><h6 class="title is-6">RND</h6></div>
						<div class="column"><h6 class="title is-6">QB</h6></div>
						<div class="column"><h6 class="title is-6">RB</h6></div>
						<div class="column"><h6 class="title is-6">WR</h6></div>
						<div class="column"><h6 class="title is-6">TE</h6></div>
						<!--<div class="column"><h6 class="title is-6">DEF</h6></div>-->
					</div>
					<div class="columns round" v-for="round in draftResults.totalRounds" :key="round">
						<div class="column is-1 round" :class="roundClass(round)"><p class="title is-6">{{ round }}</p></div>
						<div class="column">
							<ul class="rankings qb">
								<li class="ranking" v-for="p in roundPlayers(round,'QB')" :class="rankingClass(p)">
									({{ p.rank }}) {{ p.name }} ({{ p.ceiling }})
								</li>
							</ul>
						</div>
						<div class="column">
							<ul class="rankings rb">
								<li class="ranking" v-for="p in roundPlayers(round,'RB')" :class="rankingClass(p)">
									({{ p.rank }}) {{ p.name }} ({{ p.ceiling }})
								</li>
							</ul>
						</div>
						<div class="column">
							<ul class="rankings wr">
								<li class="ranking" v-for="p in roundPlayers(round,'WR')" :class="rankingClass(p)">
									({{ p.rank }}) {{ p.name }} ({{ p.ceiling }})
								</li>
							</ul>
						</div>
						<div class="column">
							<ul class="rankings te">
								<li class="ranking" v-for="p in roundPlayers(round,'TE')" :class="rankingClass(p)">
									({{ p.rank }}) {{ p.name }} ({{ p.ceiling }})
								</li>
							</ul>
						</div>
						<!--<div class="column"></div>-->
					</div>
				</div>
				<div class='column is-3'>
					<h6 class="title is-6">Draft Results</h6>
					<div class="no-draft-results" v-if="draftResults.data.length === 0"><p>No Results Yet</p></div>
					<div class="level draft-pick" v-for='draftPick in draftResultsReversed' :key="draftPick.player.player_key">
						<div class="level-left">
							<div class="level-item">{{ draftPick.pick }}</div>
							<div class="level-item">{{ draftPick.player.name }}</div>
							<div class="level-item">{{ draftPick.player.position }}</div>
						</div>
					</div>
				</div>
			</div>

	  </div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import forEach from 'lodash/forEach'
import find from 'lodash/find'
import DraftStats from '@/components/DraftStats'

export default {
  name: 'DraftBoard',
	components: { DraftStats },
	mounted() {
		//if (this.draftResults.draftStatus === 'draft') {
			//console.log('FETCH DRAFT RESULTS ON MOUNT')
			this.$store.dispatch('getDraftResults')
		//}
		this.shouldWePoll()
	},
	beforeDestroy() {
		if (this.timer) {
			console.log('Killing Draft Polling')
			clearInterval(this.timer);
			this.isPolling = false
		}
	},
	data () {
    return {
			isPolling: false,
			pollInterval: 15000 // 15seconds
    }
  },
	computed: {
		...mapState(['rankings', 'draftResults', 'league']),
		draftStatus() {
			return this.draftResults.draftStatus
		},
		draftResultsReversed() {
			return this.draftResults.data.sort((a,b) => b.pick - a.pick)
		},
		draftRankings() {
			let draftRankings = []
			this.rankings.data.forEach((ranking) => {
				const isDrafted = find(this.draftResults.data, (pick) => {
					return (pick.player_key && pick.player_key === ranking.yahooPlayerKey)
				})
				ranking.isDrafted = (isDrafted) ? true : false
				draftRankings.push(ranking)
			})
			return draftRankings
		}
	},
	watch: {
    draftStatus() {
			console.log('Draft Status Changed')
			this.shouldWePoll()
		}
	},
	methods: {
		roundClass(round) {
			return {
	      'current-round':  (this.draftResults.currentRound == round),
	    }
		},
		roundPlayers(currentRound, position) {
			let roundRankings = []
			const maxPlayersPerRound = parseInt(this.league.settings.max_teams)
			const totalPicks = this.draftResults.totalPicks
			let rankMin = 1
			let rankMax = maxPlayersPerRound

			if (currentRound !== 1) {
				for (var i = 2; i <= currentRound; i++) {
					rankMin += maxPlayersPerRound
					rankMax += maxPlayersPerRound
				}
			}

			forEach(this.draftRankings, (player) => {
				if (player.rank >= rankMin && player.rank <= rankMax && player.position === position) {
					roundRankings.push(player)
				}
			})

			return roundRankings

		},
		shouldWePoll() {
			const draftStatus = this.draftStatus
			if (/*draftStatus === 'predraft' || */draftStatus === 'draft') {
				this.pollInterval = (draftStatus === 'predraft') ? 15000 : 5000 // 30sec or 5sec
				if (!this.timer) {
					this.isPolling = true
					this.timer = setInterval(() => {
						console.log('polling', this.pollInterval)
						this.$store.dispatch('getDraftResults')
					}, this.pollInterval);
				}
				console.log('should we poll? Yes', this.pollInterval)
			} else {
        if (this.timer) {
          clearInterval(this.timer);
          this.isPolling = false
        }
				console.log('should we poll? No')
      }
		},
		rankingClass(player) {
	    return {
	      'is-grey':  (player.tier % 4 === 0),
				'is-green': (player.tier % 4 === 1),
				'is-yellow': (player.tier % 4 === 2),
				'is-blue': (player.tier % 4 === 3),
				'is-drafted': (player.isDrafted),
				'not-drafted': (!player.isDrafted),
				'is-target': player.isTarget
	    }
	  },
	}
}
</script>

<style lang="scss" scoped>
.columns.round {
	&:nth-child(odd) {
		background-color: #efefef;
	}
}
ul.rankings {
	li.ranking {
		font-size: 12px;

		&.not-drafted {
			color: green;
			&.is-target {
				text-decoration: underline;
			}
		}
		&.is-drafted {
			text-decoration: line-through;
			color: red;
		}
	}
}
.column.round {
	display: flex;
	align-items: center;
	justify-content: center;

	&.current-round {
		background: green;
		.title {
			color: #fff;
		}
	}

	.title {
		background: transparent;
		font-size: 2rem;
	}
}
</style>
