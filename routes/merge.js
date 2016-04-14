'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');


/* GET merge colors. */
router.get('/', function(req, res) {
  console.log(req.query);
  console.log(req.query.mergeTo);
  console.log(req.query.colors);
  res.status(200).send('Merged!');
});

module.exports = router;
