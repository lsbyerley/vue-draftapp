const router = require('express').Router()
const checkAuth = require('./middleware/checkAuth');

router.get('/draftapp/?*', checkAuth, (req, res) => {
  return res.render('draftapp', { title: 'Draft App', user: req.user });
});

module.exports = router
