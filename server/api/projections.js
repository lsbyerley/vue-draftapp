const router = require('express').Router()
const cache = require('../utils/cache')
const axios = require('axios')
const cheerio = require('cheerio')

router.get('/projections', cache(300), async (req, res) => {

	try{

		const positions = ['rb','wr','qb','te']
		let playerProjections = []

		for (const pos of positions) {
			const projRes = await axios.get(`https://www.fantasypros.com/nfl/projections/${pos}.php?max-yes=true&min-yes=true&scoring=HALF&week=draft`)
			const $ = cheerio.load(projRes.data)
			const projectionRows = $('tr[class*="mpb-player-"]')
			projectionRows.each((i, element) => {

				const children = $(element).children()
				let playerName = $(children[0]).find('a.player-name').text()
				const projection = $(children[children.length-1]).attr('data-sort-value')
				const playerFloor = $(children[children.length-1]).find('div.min-cell').text()
				const playerCeiling = $(children[children.length-1]).find('div.max-cell').text()

				if (playerName === 'Devante Parker'){ playerName = 'DeVante Parker' }

				playerProjections.push({
					name: playerName,
					projection,
					floor: playerFloor,
					ceiling: playerCeiling
				})
				if (parseInt(projection) < 50) {
					return false
				}

			})
		}

		playerProjections.sort((a, b) => {
			return parseInt(b.projection) - parseInt(a.projection)
		})

		return res.status(200).json(playerProjections)

	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: err })
	}

})

module.exports = router
