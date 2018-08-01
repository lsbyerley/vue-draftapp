const router = require('express').Router()

router.get('/user', (req, res) => {

	if (req.isAuthenticated()) {
		return res.status(200).json(req.user)
	} else {
		return res.status(401).json({error: 'unauthorized'})
	}

})

module.exports = router
