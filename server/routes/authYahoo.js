const router = require('express').Router()
const passport = require('passport');

router.get(
  '/auth/yahoo',
  passport.authenticate('oauth2', {
    successRedirect: '/',
    failureRedirect: '/login'
  }),
  (req, res, user) => {
    return res.redirect('/');
  }
);

module.exports = router
