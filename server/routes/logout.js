const router = require('express').Router()

router.get('/logout', (req, res) => {
  req.logout();
  return res.redirect('/login');
});

module.exports = router
