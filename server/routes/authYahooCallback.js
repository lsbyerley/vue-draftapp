const router = require('express').Router()
const passport = require('passport');

router.get(
  '/auth/yahoo/callback',
  passport.authenticate('oauth2', {
		failureRedirect: '/login'
	}),
  (req, res) => {
    return res.redirect('/draftapp');
  }
);

module.exports = router
