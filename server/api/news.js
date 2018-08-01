const router = require('express').Router()
const cache = require('../utils/cache')
const axios = require('axios')
const { formatRSSObj } = require('../utils/util')
const xml2js = require('xml2js')
const parser = new xml2js.Parser({ trim: false, normalize: true, mergeAttrs: true });

router.get('/news', cache(300), async (req, res) => {

	try{
		const url = 'http://www.rotoworld.com/rss/feed.aspx?sport=nfl&ftype=news&count=12&format=rss'
		const newsRes = await axios.get(url)

		parser.parseString(newsRes.data, (err, result) => {
			const json = formatRSSObj(result)
			return res.status(200).json(json)
		})

	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: err })
	}

})

module.exports = router
