const router = require('express').Router();
const user = require('./user')
const draftresults = require('./draftresults')
const league = require('./league')
const players = require('./players')
const news = require('./news')
const teams = require('./teams')
const projections = require('./projections')
const rankings = require('./rankings')

router.use(user)
router.use(draftresults)
router.use(league)
router.use(players)
router.use(news)
router.use(teams)
router.use(projections)
router.use(rankings)

module.exports = router
