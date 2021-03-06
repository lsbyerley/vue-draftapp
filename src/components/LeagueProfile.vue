<template>
	<div class='league-profile'>
		<article class="message is-danger" v-if="league.errorFetching">
		  <div class="message-header"><p>Error Fetching League</p></div>
		  <div class="message-body">Please check the league key and try again</div>
		</article>
		<div class='modal' id='edit-preferences-modal' :class="{ 'is-active': modalOpen }">
		  <div class='modal-background'></div>
		  <div class='modal-card'>
		    <header class='modal-card-head'>
		      <p class='modal-card-title'>Edit League Key</p>
		      <button @click="cancelModal" class='delete'></button>
		    </header>
		    <section class='modal-card-body'>
		      <label class='label'>League Key (Current: {{ league.meta.league_key }})</label>
		      <p class='control'>
		        <input class='input' :placeholder='league.meta.league_key' type='text' :model="tempKey">
		      </p>
		    </section>
		    <footer class='modal-card-foot'>
		      <a class='button is-primary modal-save' @click="updateLeague">Save changes</a>
		      <a class='button modal-cancel' @click="cancelModal">Cancel</a>
		    </footer>
		  </div>
		</div>
		<div class='section profile-heading'>

			<div class='columns is-mobile is-multiline'>
				<div class='column is-1'>
					<span class='header-icon user-profile-image'>
						<img v-if="league.meta.logo_url" :src="league.meta.logo_url">
						<img v-if="!league.meta.logo_url" src="https://s.yimg.com/cv/api/default/20180206/default-league-logo@2x.png">
					</span>
				</div>
				<div class='column is-3-tablet is-10-mobile name'>
					<p>
						<span class='title is-4 is-bold'>{{ league.meta.name }}</span>
						<a class='button is-primary is-outlined' href='#' id='edit-league-key' @click="modalOpen = true">
							Edit League Key
						</a>
						<br>
					</p>
					<p class='tagline'>
						<strong>League Key:</strong> {{ league.meta.league_key }}
					</p>
				</div>
				<div class='column is-2-tablet is-4-mobile has-text-centered'>
					<p class='stat-val'>{{ league.meta.season }}</p>
					<p class='stat-key'>season</p>
				</div>
				<div class='column is-2-tablet is-4-mobile has-text-centered'>
					<p class='stat-val'>{{ league.meta.num_teams }}</p>
					<p class='stat-key'>teams</p>
				</div>
				<div class='column is-2-tablet is-4-mobile has-text-centered'>
					<p class='stat-val'>{{ draftResults.rosterSpots }}</p>
					<p class='stat-key'>roster spots</p>
				</div>
				<div class='column is-2-tablet is-4-mobile has-text-centered'>
					<p class='stat-val' :class="draftStatusClass">{{ draftStatus }}</p>
					<p class='stat-key'>draft status</p>
				</div>
			</div>

		</div>
		<div class='profile-options is-fullwidth'>
			<div class='tabs is-fullwidth is-medium'>
				<ul>
					<router-link class="link" tag="li" to="/draftapp/lobby" active-class="is-active" exact>
						<a>
							<span class='icon'>
								<i class='fa fa-list'></i>
							</span>
							<span>Lobby</span>
						</a>
					</router-link>
					<router-link class="link" tag="li" to="/draftapp/draftroom" active-class="is-active" exact>
						<a>
							<span class='icon'>
								<i class='fa fa-list'></i>
							</span>
							<span>Draft Room</span>
						</a>
					</router-link>
					<router-link class="link" tag="li" to="/draftapp/draftboard" active-class="is-active" exact>
						<a>
							<span class='icon'>
								<i class='fa fa-list'></i>
							</span>
							<span>Draft Board</span>
						</a>
					</router-link>
					<router-link class="link" tag="li" to="/draftapp/rankings" active-class="is-active" exact>
						<a>
							<span class='icon'>
								<i class='fa fa-list'></i>
							</span>
							<span>Rankings</span>
						</a>
					</router-link>
					<router-link class="link" tag="li" to="/draftapp/playerpool" active-class="is-active" exact>
						<a>
							<span class='icon'>
								<i class='fa fa-list'></i>
							</span>
							<span>Player Pool</span>
						</a>
					</router-link>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'LeagueProfile',
  data () {
    return {
			modalOpen: false,
      tempKey: ''
    }
  },
	computed: {
    ...mapState(['league', 'draftResults']),
		draftStatus() {
			if (this.draftResults.draftStatus === 'predraft') {
				return 'Pre'
			} else if (this.draftResults.draftStatus === 'draft') {
				return 'Live'
			} else if (this.draftResults.draftStatus === 'postdraft') {
				return 'Post'
			} else {
				return '-'
			}
		},
		draftStatusClass() {
			return {
				'has-text-info': this.draftStatus === 'Pre',
				'has-text-success': this.draftStatus === 'Live',
				'has-text-info': this.draftStatus === 'Post'
			}
		}
	},
	methods: {
		updateLeague() {
			this.modalOpen = false
		},
		cancelModal() {
			this.modalOpen = false
			this.tempKey = ''
		}
	}
}
</script>

<style lang="scss" scoped>
.profile-heading {
	background-color: #fff;
	padding: 1rem;
}
.stat-val {
	font-size: 2em;
	font-weight: bold;
}

.stat-key {
	font-size: 1.4em;
	font-weight: 200
}

#edit-league-key {
	margin: 5px 0;
}

.section.profile-heading .column.is-2-tablet.has-text-centered + .has-text-centered {
	border-left: 1px dotted rgba(0, 0, 0, .2);
}

.control.is-pulled-left span.select {
	margin-right: 5px;
	border-radius: 2px;
}

.profile-options .tabs ul {
	margin-bottom: 1rem;
}

.profile-options .tabs ul li.link a {
	//margin-bottom: 20px;
	padding: .5rem;
	background-color: #F1F1F1;
}
</style>
