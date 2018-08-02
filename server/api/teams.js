const router = require('express').Router()

router.get('/teams', (req, res) => {

	const leagueKey = config.LEAGUE_KEY

	if (req.isAuthenticated()) {

		yf.setUserToken(req.user.access_token)

		yf.teams.leagues(leagueKey, (err, data) => {

			if (!err) {
				return res.status(200).json(data)
			} else {
				return res.status(500).json({'error': err})
			}

		})

	} else {
		return res.status(401).json({error: 'unauthorized'})
	}

})

module.exports = router
