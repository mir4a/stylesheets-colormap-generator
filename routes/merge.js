'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');



/* GET merge colors. */
router.get('/', function(req, res) {
  let schemeMap = req.app.locals.scheme;
  let colorsMap = req.app.locals.colors;
  let mergeTo = req.query.mergeTo;
  let mergedColors = req.query.colors;

  mergeColorsHandler(colorsMap, mergeTo, mergedColors);

  res.status(200).send('Merged!');
});

function mergeColorsHandler(colorsMap, mergeTo, mergedColors) {
  let colors = mergedColors.split(';');
  console.log(colors);

  for (let i in colors) {
    let colorObj = colorsMap.get(colors[i]);

    console.log(mergeTo);
    console.log(colors[i]);
    console.log(colorObj);
  }

}

function handleEditFiles(list, variable) {

}

module.exports = router;
