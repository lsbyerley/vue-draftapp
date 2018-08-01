<template>
	<div class='box playerpool'>
		<p>Total: {{ playerPool.data.length }}</p>
		<div class='columns is-multiline'>
      <div class='column is-2' v-if="i <= 11" v-for="(p, i) in playerPool.data">
        <div class='card'>
					<div class='card-image'>
						<figure class='image is-4x5'>
							<img alt='' :src="p.headshot">
						</figure>
					</div>
          <div class='card-content'>
            <div class='content'>
              <span class='tag is-dark subtitle'>{{ p.name }}</span>
              <p class="team">{{ p.team }}</p>
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
	computed: {
    ...mapState(['playerPool'])
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
			.team {
				text-align: center;
				font-size: 12px;
				padding: 2px;
			}
		}
	}
}
.card-image figure.image {
	background-color: #ccc;
}
</style>
