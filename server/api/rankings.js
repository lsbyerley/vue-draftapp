const router = require('express').Router()
const cache = require('../utils/cache')
const axios = require('axios')
const csv = require('csvtojson')
const forEach = require('lodash/forEach')
const { abbrev_teams } = require('../utils/util')

router.get('/rankings', cache(300), async (req, res) => {

	try{
		// https://rankings.rotoballer.com:8000/api/players?league=Overall&page=1&perPage=200&spreadsheet=ppr&twoQb=false
		// Boris Chen Fantasy Pros Rankings
		/*const url = `https://jayzheng-ff-api.herokuapp.com/rankings?format=half_ppr`
		const rankingsRes = await axios.get(url)
		return res.status(200).json(rankingsRes.data.rankings)*/

		// ProFootballFocus Half PPR
		// url of csv https://www.profootballfocus.com/fantasy/leagues/66213/draft_board
		const path = 'public/rankings/league-export.csv'
		const jsonObj = await csv().fromFile(path);
		const rankings = []

		forEach(jsonObj, (rank, i) => {

			const position = rank['Position'].toUpperCase()
			let name = rank['Name'].replace(' DST', '')
			if (position === 'DST' && abbrev_teams[rank['Team']]) {
				name = abbrev_teams[rank['Team']]
			}

			// Name Affixes: III, II, Jr., Sr., V (Will Fuller V)
			const affixes = RegExp(`(\\sIII|\\sII|\\sV$|\\sIV|\\sJr\.|\\sSr\.)`)
			foundAffix = affixes.test(name)
			if (foundAffix) {
				name = name.replace(affixes, '')
			}

			let pffId = rank['Id']
			let pffUrl
			let idTokens = pffId.split('-')
			if (idTokens.length === 3 && position !== 'DST') {
				pffId = idTokens[2]
				pffUrl = `https://www.profootballfocus.com/nfl/id/player/${pffId}`
			}

			rankings.push({
				id: pffId,
				url: pffUrl,
				name: name,
				team: rank['Team'],
				bye: rank['Bye'],
				position: position,
				projPoints: rank['Proj Pts'],
				voRepl: rank['VoRepl'],
				voNext: rank['VoNext'],
				auctionVal: rank['Auction $'],
				rank: rank['PFF Ranking'],
				expertRank: rank['Expert Ranking'],
				projBasedRank: rank['Projection-Based Ranking'],
				adp: rank['ADP']
			})

			if (i >= 199)
				return false
		})

		return res.status(200).json(rankings)

	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: err })
	}

})

module.exports = router
