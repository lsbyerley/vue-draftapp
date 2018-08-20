<template>
  <div id="app">
		<Loading :active.sync="appLoading"></Loading>
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
	  <div class='container is-fluid' v-if="!appLoading">
			<LeagueProfile />
			<router-view/>
		</div>
		<footer class="footer">
		  <div class="content has-text-centered">
		    <p>
		      <strong>Vue DraftApp</strong> by <a href="https://twitter.com/lsbyerley">lsbyerley</a>
		    </p>
		  </div>
		</footer>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import LeagueProfile from '@/components/LeagueProfile'
import { mapState } from 'vuex'

export default {
  name: 'app',
	components: {
		Loading,
		LeagueProfile
	},
	mounted() {
		this.init()
	},
	computed: {
		...mapState(['authModalOpen','appLoading'])
	},
	methods: {
		async init() {
			console.time('App Init')
			this.$store.commit('setAppLoading', { loading: true })
			await this.$store.dispatch('getLeague');
			await this.$store.dispatch('getNews');
			await this.$store.dispatch('getProjections');
			await this.$store.dispatch('getPlayerPool');
			await this.$store.dispatch('getDraftResults');
			await this.$store.dispatch('getRankings');
			this.$store.commit('setAppLoading', { loading: false })
			console.timeEnd('App Init')
		}
	}
}
</script>

<style lang="scss">
@import './assets/styles/style';
.footer {
	background: #ebeff5;
	border-top: 1px solid rgba(10, 10, 10, 0.1);
	padding: 3rem;
	margin-top: 1rem;
}
</style>
