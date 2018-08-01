<template>
  <div id="app">
		<div class='modal' id='edit-preferences-modal' :class="{ 'is-active': authModalOpen }">
		  <div class='modal-background'></div>
		  <div class='modal-card'>
		    <header class='modal-card-head'>
		      <p class='modal-card-title'>Yahoo! Token Expired</p>
		    </header>
		    <section class='modal-card-body'>
		      <label class='label'>Please login with Yahoo! again</label>
		      <a class='button is-primary modal-save' href="/auth/yahoo">Login With Yahoo!</a>
		    </section>
		  </div>
		</div>
	  <div class='container'>
			<LeagueProfile />
			<router-view/>
		</div>
  </div>
</template>

<script>
import LeagueProfile from '@/components/LeagueProfile'
import { mapState } from 'vuex'

export default {
  name: 'app',
	components: {
		LeagueProfile
	},
	mounted() {
		if (!this.leagueFetched) {
			this.init()
		}
	},
	computed: {
		...mapState(['authModalOpen'])
	},
	methods: {
		async init() {
			console.time('App Init')
			await this.$store.dispatch('getLeague');
			await this.$store.dispatch('getNews');
			await this.$store.dispatch('getPlayerPool');
			await this.$store.dispatch('getDraftResults');
			await this.$store.dispatch('getPlayerRankings');
			console.timeEnd('App Init')
		}
	}
}
</script>

<style lang="scss">
@import './assets/styles/style';

</style>
