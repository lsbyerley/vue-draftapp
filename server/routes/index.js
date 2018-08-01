const router = require('express').Router();
const checkAuth = require('./middleware/checkAuth');

const login = require('./login')
const logout = require('./logout')
const authYahoo = require('./authYahoo')
const authYahooCallback = require('./authYahooCallback')
const draftApp = require('./draftApp')

router.use(login)
router.use(logout)
router.use(authYahoo)
router.use(authYahooCallback)
router.use(draftApp)

router.get('/', checkAuth, (req, res) => {
  return res.render('index', { title: 'Draft App Home' });
});

module.exports = router;
