<template>
	<div class="level draft-stats sticky">
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
	margin: 0;
	font-size: 13px;
	padding: .5rem 0 .25rem 0;
	margin-bottom: 1.25rem;
	box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
	border-top: 0;
	border-bottom: 0;

	&.sticky {
		position: -webkit-sticky;
		position: sticky;
		background: #fff;
		top: 0;
	}
}
</style>
