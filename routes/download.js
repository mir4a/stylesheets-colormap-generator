'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const jade = require('jade');
const gatherColors = require('../helpers/getAllColors');

/* GET colors listing. */
router.get('/', function(req, res) {
  if (req.app.locals.colors) {
    let colors = {};
    colors.count = req.app.locals.colors.size;
    colors.html = gatherColors.markup(req.app.locals.colors);
    let filename = 'colors.html';
    let content = jade.renderFile('./views/download/body.jade', {
      colors: colors,
      pretty: true,
      globals: [colors],
    });

    res.setHeader('Content-Length', content.length);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'text/html');
    res.send(content);

  } else {
    res.redirect('/colors');
  }
});

module.exports = router;
