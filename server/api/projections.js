const router = require('express').Router()
//const cache = require('../utils/cache')
const axios = require('axios')
const cheerio = require('cheerio')

router.get('/projections', async (req, res) => {

	try{

		const url = 'https://www.fantasypros.com/nfl/projections/rb.php?max-yes=true&min-yes=true&scoring=HALF&week=draft'
		const projRes = await axios.get(url)

		const $ = cheerio.load(projRes.data)
		const projectionRows = $('tr[class*="mpb-player-"]')

		console.log(projectionRows.length)

		let playerProjections = []
		projectionRows.each((i, element) => {

			const children = $(element).children()
			const playerName = $(children[0]).find('a.player-name').text()
			const projection = $(children[children.length-1]).attr('data-sort-value')
			const playerFloor = $(children[children.length-1]).find('div.min-cell').text()
			const playerCeiling = $(children[children.length-1]).find('div.max-cell').text()

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

		return res.status(200).json(playerProjections)

	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: err })
	}

})

module.exports = router
