const router = require('express').Router()

router.get('/login', (req, res) => {
  return res.render('login', { title: 'Please Login' });
});

module.exports = router
