var express = require('express');
var router = express.Router();

/* GET colors listing. */
router.get('/', function(req, res) {
  res.render('colors', { title: 'Colors' });
});

module.exports = router;
