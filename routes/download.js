'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const gatherColors = require('../helpers/getAllColors');

/* GET colors listing. */
router.get('/', function(req, res) {
  if (req.app.locals.colors) {
    let colors = req.app.locals.colors;
    let filename = 'Colors.html';
    console.log(colors);
    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-type', 'text/html');
    res.send('<html>some</html>')
    // res.render('colors', { title: `${colors.size} colors found`, colors: [...colors.keys()], html: html, masterColors: scheme });
  } else {
    res.redirect('/colors');
  }
});

module.exports = router;
