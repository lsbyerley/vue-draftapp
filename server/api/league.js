const router = require('express').Router()
const cache = require('../utils/cache')
const request = require('request')

router.get('/league', cache(300), (req, res) => {

	const leagueKey = config.LEAGUE_KEY

	if (req.isAuthenticated()) {

		yf.setUserToken(req.user.access_token)

		yf.league.settings(leagueKey, (err, data) => {

			if (!err) {

				const settings = data.settings
				const meta = data
				delete meta.settings

				return res.status(200).json({
					'meta': meta,
					'settings': settings
				})

			} else {
				return res.status(500).json({'error': err})
			}

		})

	} else {
		return res.status(401).json({error: 'unauthorized'})
	}

})

module.exports = router
