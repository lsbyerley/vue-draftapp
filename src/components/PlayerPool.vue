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
						<input v-model="search" class="input" type="text" placeholder="Search Players">
					</div>
		    </div>
		  </div>
			<div class="level-item has-text-centered">
				<button class="button is-primary" @click="prevPage" :disabled="(pageNumber === 0)">Previous</button>
				<button class="button is-primary" @click="nextPage" :disabled="(pageNumber >= pageCount -1)">Next</button>
			</div>
			<div class="level-item has-text-centered">
				Page {{ pageNumber+1 }} of {{ pageCount }}
			</div>
		</div>

		<div class='columns is-multiline'>
      <div class='column is-2' v-for="(p, i) in paginatedData">
        <div class='card'>
					<div class='card-image' v-if="paginatedData.length <= 12">
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
			search: '',
			pageNumber: 0,
			size: 24
		}
	},
	computed: {
    ...mapState(['playerPool']),
		filteredPlayers() {
      return this.playerPool.data.filter(p => {
				return p.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
		pageCount(){
			let l = this.filteredPlayers.length
			let s = this.size
			return Math.floor(l/s)
		},
		paginatedData(){
			const start = this.pageNumber * this.size
			const end = start + this.size;
			return this.filteredPlayers.slice(start, end);
		}
	},
	methods: {
		nextPage(){
			this.pageNumber++
		},
		prevPage(){
			this.pageNumber--
		}
	}
};
</script>

<style lang='scss'>
.box.playerpool {
	.button:nth-child(1) {
		margin-right: 10px;
	}
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
