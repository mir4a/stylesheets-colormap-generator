'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const gatherColors = require('../helpers/getAllColors');
const jade = require('jade');

/* GET colors listing. */
router.get('/', function(req, res) {
  var stylesheetsPath = path.resolve(req.app.locals.colormapProject, req.app.locals.colormapSettings['stylesheets-path']);
  var colors = gatherColors.gather(stylesheetsPath, req.app.locals.colormapSettings['scheme-path']);
  var html = gatherColors.markup(colors);
  res.render('colors', { title: 'Colors', colors: [...colors.keys()], html: html });
});

module.exports = router;
