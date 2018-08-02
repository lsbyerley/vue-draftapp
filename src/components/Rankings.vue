<template>
	<div class='box rankings'>
		<div class='columns'>
			<div class='column is-3'>
				<h6 class="title is-6">Running Backs</h6>
				<div class="level ranking" v-for='(p, i) in rbRankings' :class="tierClass(p.tier)">
					<div class="level-left">
						<div class="level-item">{{ i+1 }}</div>
						<div class="level-item">Tier {{ p.tier }}</div>
						<div class="level-item">{{ p.name }}</div>
					</div>
					<div class="level-right">
						<div class="level-item" v-if="p.note">{{ p.note }}</div>
						<div class="level-item" v-if="p.floor">FL: {{ p.floor }}</div>
					</div>
				</div>
			</div>
			<div class='column is-3'>
				<h6 class="title is-6">Wide Receivers</h6>
				<div class="level ranking" v-for='(p, i) in wrRankings' :class="tierClass(p.tier)">
					<div class="level-left">
						<div class="level-item">{{ i+1 }}</div>
						<div class="level-item">Tier {{ p.tier }}</div>
						<div class="level-item">{{ p.name }}</div>
					</div>
				</div>
			</div>
			<div class='column is-3'>
				<h6 class="title is-6">Quarterbacks</h6>
				<div class="level ranking" v-for='(p, i) in qbRankings' :class="tierClass(p.tier)">
					<div class="level-left">
						<div class="level-item">{{ i+1 }}</div>
						<div class="level-item">Tier {{ p.tier }}</div>
						<div class="level-item">{{ p.name }}</div>
					</div>
				</div>
			</div>
			<div class='column is-3'>
				<h6 class="title is-6">Tight Ends</h6>
				<div class="level ranking" v-for='(p, i) in teRankings' :class="tierClass(p.tier)">
					<div class="level-left">
						<div class="level-item">{{ i+1 }}</div>
						<div class="level-item">Tier {{ p.tier }}</div>
						<div class="level-item">{{ p.name }}</div>
					</div>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'Rankings',
	computed: {
		rbRankings() {
			return this.$store.getters.rankingsByPos('RB')
		},
		wrRankings() {
			return this.$store.getters.rankingsByPos('WR')
		},
		qbRankings() {
			return this.$store.getters.rankingsByPos('QB')
		},
		teRankings() {
			return this.$store.getters.rankingsByPos('TE')
		}
	},
	methods: {
		tierClass(tier) {
	    return {
	      'is-grey':  (tier % 4 === 0),
				'is-green': (tier % 4 === 1),
				'is-yellow': (tier % 4 === 2),
				'is-blue': (tier % 4 === 3)
	    }
	  }
	}
};
</script>

<style lang='scss'>
.box.rankings {

}
</style>
