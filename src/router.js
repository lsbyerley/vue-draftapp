import Vue from 'vue'
import Router from 'vue-router'

import Lobby from '@/components/Lobby'
import DraftRoom from '@/components/DraftRoom'
import PlayerPool from '@/components/PlayerPool'
import Rankings from '@/components/Rankings'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: [
		{
			path: '*',
			redirect: '/draftapp/lobby'
		},
		{
			path: '/draftapp/lobby',
			name: 'Lobby',
			component: Lobby
		},
		{
			path: '/draftapp/draftroom',
			name: 'DraftRoom',
			component: DraftRoom
		},
		{
			path: '/draftapp/playerpool',
			name: 'PlayerPool',
			component: PlayerPool
		},
		{
			path: '/draftapp/rankings',
			name: 'Rankings',
			component: Rankings
		}
	]
})

export default router
