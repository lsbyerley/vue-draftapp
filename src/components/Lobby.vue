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
				<div v-for="a in articles">
					<a target="_blank" :href="a.link">{{ a.title }}</a>
				</div>
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
			articles: [
				{
					title: 'RB Super Chart 2018',
					link: 'https://www.fantasypros.com/2018/07/the-running-back-super-chart-2018-fantasy-football'
				},
				{
					title: 'Offensive Line Rankings',
					link: 'https://www.profootballfocus.com/news/pro-nfl-offensive-line-rankings-all-32-teams-units-entering-2018'
				},
				{
					title: 'RBs helped/hurt by OLine',
					link: 'https://www.profootballfocus.com/news/fantasy-football-running-backs-most-helped-and-hurt-by-their-offensive-lines'
				},
				{
					title: 'Fantasy Pros Half-PPR rankings',
					link: 'https://www.fantasypros.com/nfl/rankings/half-point-ppr-cheatsheets.php?filters=0fb547ca62'
				},
				{
					title: 'PFF QB Tiers',
					link: 'https://www.profootballfocus.com/news/fantasy-football-2018-rankings-quarterback-tiers'
				},
				{
					title: 'PFF RB Tiers',
					link: 'https://www.profootballfocus.com/news/fantasy-football-2018-rankings-running-back-tiers'
				}
			]
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
	//display: block;
}
</style>
