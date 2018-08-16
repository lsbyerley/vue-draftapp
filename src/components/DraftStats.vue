<template>
	<div class="level draft-stats">
		<div class="level-item has-text-centered">
			<div>
				<p class="heading">Total Rounds</p>
				<p class="title">{{ draftResults.totalRounds }}</p>
			</div>
		</div>
		<div class="level-item has-text-centered">
			<div>
				<p class="heading">Total Picks</p>
				<p class="title">{{ draftResults.totalPicks }}</p>
			</div>
		</div>
		<div class="level-item has-text-centered">
			<div>
				<p class="heading">Overall Pick</p>
				<p class="title">{{ draftResults.overallPick }}</p>
			</div>
		</div>
		<div class="level-item has-text-centered">
			<div>
				<p class="heading">Current Round</p>
				<p class="title">{{ draftResults.currentRound }}</p>
			</div>
		</div>
		<div class="level-item has-text-centered">
			<div>
				<p class="heading">Current Pick</p>
				<p class="title">{{ draftResults.currentPick }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DraftStats',
	computed: {
		...mapState(['draftResults'])
	}
}
</script>

<style lang="scss">
.level.draft-stats{
	border-top: 1px solid #ddd;
	margin: 0;
	font-size: 13px;
	padding: .5rem 0 .25rem 0;
	border-bottom: 1px solid #ddd;
	margin-bottom: 1.25rem;
}
</style>
