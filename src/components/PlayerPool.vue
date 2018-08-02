<template>
	<div class='box playerpool'>

		<div class="level player-search">
		  <div class="level-item has-text-centered">
		    <div>
		      <p>Total Players: {{ playerPool.data.length }}</p>
		    </div>
		  </div>
		  <div class="level-item has-text-centered">
		    <div>
					<div class="control">
						<input v-model="search" class="input" type="text" placeholder="Search Player Pool">
					</div>
		    </div>
		  </div>
		</div>

		<div class='columns is-multiline'>
      <div class='column is-2' v-for="(p, i) in filteredPlayers">
        <div class='card'>
					<div class='card-image' v-if="filteredPlayers.length <= 6">
						<figure class='image is-45x60'>
							<img alt='' :src="p.headshot">
						</figure>
					</div>
          <div class='card-content'>
            <div class='content'>
              <span class='tag is-dark subtitle'>{{ p.name }}</span>
              <p class="info">{{ p.team }}</p>
							<p class="info"><strong>Yahoo! Key</strong>: {{ p.player_key }}</p>
            </div>
          </div>
        </div>
        <br>
      </div>
		</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'PlayerPool',
	data() {
		return {
			search: ''
		}
	},
	computed: {
    ...mapState(['playerPool']),
		filteredPlayers() {
      return this.playerPool.data.filter(p => {
				return p.name.toLowerCase().includes(this.search.toLowerCase())
      })
    }
	}
};
</script>

<style lang='scss'>
.box.playerpool {
	.card {
		.card-content {
			padding: 0;
			.tag {
				width: 100%;
				text-align: center;
				padding: 3px 0;
				border-radius: 0;
				margin-bottom: 3px;
			}
			.info {
				text-align: center;
				font-size: 12px;
				padding: 2px;
				margin: 0;
			}
		}
	}
}
.card-image {
	display: flex;
	justify-content: center;

	figure.image {
		background-color: #ccc;

		&.is-45x60 {
			width: 45px;
			height: 60px;
		}
	}
}
</style>
