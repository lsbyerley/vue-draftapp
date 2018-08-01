<template>

	<div class="columns">
		<div class="column is-8">
			<div class='box'>
				<h1 class="title is-4">Latest NFL Headlines</h1>
		    <div class="news-item" v-for="item in news.data">
					<a :href="item.url" target="_blank">
						<p class="title is-5">{{ item.title }}</p>
						<p class="subtitle is-6">{{ item.description }}</p>
					</a>
				</div>
		  </div>
		</div>
		<div class="column is-4">
			<div class='box articles'>
				<h1 class="title is-4">Note Worthy Articles</h1>
				<a target="_blank" href="https://www.fantasypros.com/2018/07/the-running-back-super-chart-2018-fantasy-football/">RB Super Chart 2018</a>
				<a target="_blank" href="https://www.profootballfocus.com/news/pro-nfl-offensive-line-rankings-all-32-teams-units-entering-2018">Offensive Line Rankings</a>
			</div>
		</div>
	</div>

</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'Lobby',
	data() {
		return {
			msg: 'WELCOME TO DRAFT APP'
		};
	},
	computed: {
    ...mapState(['news'])
	}
};
</script>

<style lang='scss'>
.news-item {
	margin: 0 0 1rem 0;

	a {
		display: block;
		padding: .25rem;
		
		&:hover {
			background: #f3f3f3;
		}
	}
}
.box.articles a {
	display: block;
}
</style>
