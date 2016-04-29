'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const gatherColors = require('../helpers/getAllColors');

/* GET colors listing. */
router.get('/', function(req, res) {
  if (req.app.locals.colormapSettings) {
    let stylesheetsPath = req.app.locals.colormapSettings.stylesheetsPath;
    let colorSchemePath = req.app.locals.colormapSettings.schemePath;
    var colors = gatherColors.gather(stylesheetsPath, colorSchemePath);
    var html = gatherColors.markup(colors);
    var scheme = gatherColors.scheme(colorSchemePath);

    req.app.locals.colors = colors;
    req.app.locals.scheme = scheme;

    res.render('colors', { title: `${colors.size} colors found`, colors: [...colors.keys()], html: html, masterColors: scheme });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
