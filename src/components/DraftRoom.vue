<template>
	<div class="draftroom">
		<DraftStats />
		<div class='box draftroom'>

			<div class='columns'>
				<div class='column is-3 scrollable'>
					<h6 class="title is-6">Overall Rankings</h6>
					<div class="level ranking" v-for='p in overallRankings' :class="rankingClass(p)" :key="p.id">
						<div class="level-left">
							<div class="level-item">{{ p.rank }}</div>
							<div class="level-item" v-if="p.tier">Tier {{ p.tier }}</div>
							<div class="level-item">{{ p.position }}</div>
							<div class="level-item">{{ p.name }}</div>
						</div>
						<div class="level-right">
							<div class="level-item" v-if="p.note">{{ p.note }}</div>
							<div class="level-item" v-if="p.projPoints">{{ p.projPoints }}</div>
						</div>
					</div>
				</div>
				<div class='column'>
					<h6 class="title is-6">Top Picks By Position</h6>
					<div class='columns is-multiline'>
						<div class='column is-half'>
							<h6 class="subtitle is-6">Running Backs</h6>
							<div class="level ranking" v-for="p in rbRankings" :class="rankingClass(p)" :key="p.rank">
								<div class="level-left">
									<div class="level-item" v-if="p.tier">Tier {{ p.tier }}</div>
									<div class="level-item">{{ p.name }}</div>
								</div>
								<div class="level-right">
									<div class="level-item" v-if="p.note">{{ p.note }}</div>
									<div class="level-item" v-if="p.projPoints">{{ p.projPoints }}</div>
								</div>
							</div>
						</div>
						<div class='column is-half'>
							<h6 class="subtitle is-6">Wide Receivers</h6>
							<div class="level ranking" v-for="p in wrRankings" :class="rankingClass(p)" :key="p.rank">
								<div class="level-left">
									<div class="level-item" v-if="p.tier">Tier {{ p.tier }}</div>
									<div class="level-item">{{ p.name }}</div>
								</div>
								<div class="level-right">
									<div class="level-item" v-if="p.isTarget">(T)</div>
									<div class="level-item" v-if="p.note">{{ p.note }}</div>
									<div class="level-item" v-if="p.projPoints">{{ p.projPoints }}</div>
								</div>
							</div>
						</div>
						<div class='column is-half'>
							<h6 class="subtitle is-6">Quarterbacks</h6>
							<div class="level ranking" v-for="p in qbRankings" :class="rankingClass(p)" :key="p.rank">
								<div class="level-left">
									<div class="level-item" v-if="p.tier">Tier {{ p.tier }}</div>
									<div class="level-item">{{ p.name }}</div>
								</div>
								<div class="level-right">
									<div class="level-item" v-if="p.note">{{ p.note }}</div>
									<div class="level-item" v-if="p.projPoints">{{ p.projPoints }}</div>
								</div>
							</div>
						</div>
						<div class='column is-half'>
							<h6 class="subtitle is-6">Tight Ends</h6>
							<div class="level ranking" v-for="p in teRankings" :class="rankingClass(p)" :key="p.rank">
								<div class="level-left">
									<div class="level-item" v-if="p.tier">Tier {{ p.tier }}</div>
									<div class="level-item">{{ p.name }}</div>
								</div>
								<div class="level-right">
									<div class="level-item" v-if="p.note">{{ p.note }}</div>
									<div class="level-item" v-if="p.projPoints">{{ p.projPoints }}</div>
								</div>
							</div>
						</div>
						<div class='column is-half'>
							<h6 class="subtitle is-6">Defense</h6>
							<div class="level ranking" v-for="p in dstRankings" :class="rankingClass(p)" :key="p.id">
								<div class="level-left">
									<div class="level-item">({{ p.rank }})</div>
									<div class="level-item" v-if="p.tier">Tier {{ p.tier }}</div>
									<div class="level-item">{{ p.name }}</div>
								</div>
							</div>
						</div>
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
import { mapState, mapGetters } from 'vuex'
import find from 'lodash/find'
import DraftStats from '@/components/DraftStats'

export default {
  name: 'DraftRoom',
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
			showPerPos: 15,
			isPolling: false,
			pollInterval: 15000 // 15seconds
    }
  },
	computed: {
		...mapState(['rankings', 'draftResults']),
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
		},
		overallRankings() {
			return this.draftRankings.filter(p => !p.isDrafted)
		},
		rbRankings() {
			return this.draftRankings.filter(p => p.position === 'RB' && !p.isDrafted).slice(0, this.showPerPos)
		},
		wrRankings() {
			return this.draftRankings.filter(p => p.position === 'WR' && !p.isDrafted).slice(0, this.showPerPos)
		},
		qbRankings() {
			return this.draftRankings.filter(p => p.position === 'QB' && !p.isDrafted).slice(0, this.showPerPos)
		},
		teRankings() {
			return this.draftRankings.filter(p => p.position === 'TE' && !p.isDrafted).slice(0, this.showPerPos)
		},
		dstRankings() {
			return this.draftRankings.filter(p => p.position === 'DST' && !p.isDrafted).slice(0, this.showPerPos)
		}
	},
	watch: {
    draftStatus() {
			console.log('Draft Status Changed')
			this.shouldWePoll()
		}
	},
	methods: {
		rankingsPerRound(round, positon) {

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
	}
}
</script>

<style lang="scss">
.column.scrollable {
	overflow-y: auto;
	height: 850px;
}
</style>
