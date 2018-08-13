<template>
	<div class='box draftboard'>

		<div class="columns">
			<div class="column is-1">RND</div>
			<div class="column">QB</div>
			<div class="column">RB</div>
			<div class="column">WR</div>
			<div class="column">TE</div>
			<div class="column">Defense</div>
		</div>

		<div class="columns round" v-for="round in draftResults.totalRounds" :key="round">
			<div class="column is-1">{{ round }}</div>
			<div class="column">
				<ul class="rankings qb">
					<li class="ranking" v-for="p in roundPlayers(round,'QB')" :class="rankingClass(p)">({{ p.rank }}) {{ p.name }}</li>
				</ul>
			</div>
			<div class="column">
				<ul class="rankings rb">
					<li class="ranking" v-for="p in roundPlayers(round,'RB')" :class="rankingClass(p)">({{ p.rank }}) {{ p.name }}</li>
				</ul>
			</div>
			<div class="column">
				<ul class="rankings wr">
					<li class="ranking" v-for="p in roundPlayers(round,'WR')" :class="rankingClass(p)">({{ p.rank }}) {{ p.name }}</li>
				</ul>
			</div>
			<div class="column">
				<ul class="rankings te">
					<li class="ranking" v-for="p in roundPlayers(round,'TE')" :class="rankingClass(p)">({{ p.rank }}) {{ p.name }}</li>
				</ul>
			</div>
			<div class="column"></div>
		</div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import forEach from 'lodash/forEach'

export default {
  name: 'DraftBoard',
	mounted() {
		this.shouldWePoll()
		if (this.draftResults.draftStatus === 'draft') {
			console.log('POLLING ON MOUNT')
			this.$store.dispatch('getDraftResults')
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
		roundPlayers(currentRound, position) {
			let roundRankings = []
			if (this.draftRankings.length > 0) {
				const maxPlayersPerRound = 12 //this.league.settings.max_teams
				const totalPicks = this.draftResults.totalPicks

				let rankMin = 1
				let rankMax = parseInt(this.league.settings.max_teams)

				if (currentRound !== 1) {
					for (var i = 2; i <= currentRound; i++) {
						//console.log(i, rankMin, rankMax, currentRound, maxPlayersPerRound)
						rankMin += maxPlayersPerRound
						rankMax += maxPlayersPerRound
					}
				} else {
					//console.log('FIRSTROUND', i, rankMin, rankMax, currentRound, maxPlayersPerRound)
				}

				//console.log('CurrRound: '+currentRound,'Pos: '+ position, 'RankMin: '+rankMin+' RankMax: '+rankMax)
				console.log('RankMin: '+rankMin+' RankMax: '+rankMax)

				forEach(this.draftRankings, (player) => {
					if (player.rank >= rankMin && player.rank <= rankMax && player.position === position) {
						roundRankings.push(player)
					}
					//if (roundRankings.length >= maxPlayersPerRound)
						//return false;
				})
				console.log('Round '+currentRound, 'TOTAL '+position+' '+roundRankings.length)
				//console.log('-----------------------')
			}

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
				'not-drafted': (!player.isDrafted)
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
	}
}
</style>
