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
    handleEditFiles(colorObj.meta, mergeTo);
    // console.log(mergeTo);
    // console.log(colors[i]);
    // console.log(colorObj);
  }

}

function handleEditFiles(list, variable) {
    while (list.length > 0) {

      console.log('fucks!')
      let fileObj = list[list.length - 1];
      let filePath = fileObj.path.split(':');

      try {
        let writable = fs.createWriteStream(filePath[0], {defaultEncoding: 'utf-8', start:fileObj.startPos});

        writable.on('error', (err)=> {
          console.log(`write to ${filePath[0]} raised error`);
          console.error(err);
        });
        writable.on('finish', ()=> {
          console.log(`write to ${filePath[0]} is finished`);
        });
        console.log(variable);
        writable.end(variable, 'utf-8');
      } catch (err) {
        console.log(err);
      }
      list.pop();

  }
}

module.exports = router;
