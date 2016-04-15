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
    let color = colors[i];
    let colorObj = colorsMap.get(color);
    let colorDataMap = groupColorDataByFile(colorObj.meta);
    handleEditFiles(colorDataMap, mergeTo);
  }

}

function groupColorDataByFile(meta) {
  var map = new Map();
  for (let i in meta) {
    if (map.has(meta[i].filePath)) {
      let colorData = map.get(meta[i].filePath);
      colorData.push({startPos: meta[i].startPos, color: meta[i].originalValue});
      map.set(meta[i].filePath, colorData);
    } else {
      let colorData = [{startPos: meta[i].startPos, color: meta[i].originalValue}];
      map.set(meta[i].filePath, colorData);
    }
  }
  return map;
}

function handleEditFiles(colorDataMap, variable) {
  //FIXME: One file with multiple needle occurrences should be read>write in one cycle

  for (let filePath of colorDataMap.keys()) {
    let colorData = colorDataMap.get(filePath);
    let fileName = path.basename(filePath);
    let fileDir = path.dirname(filePath);
    let readable = fs.createReadStream(filePath, 'utf-8');
    let writable = fs.createWriteStream(path.resolve(fileDir, fileName + '.tmp'));
    let readDataLength = 0;
    let firstStartPos = 0;
    let color = null;
    readable.pause();

    writable.on('error', (err)=> {
      console.log(`write to ${filePath} raised error`);
      console.error(err);
    });

    writable.on('finish', ()=> {
      console.log(`write to ${filePath} is finished`);
      fs.rename(filePath, path.resolve(fileDir, fileName + '.tmp'));
    });

    readable.on('data', (chunk) => {
      let chunkLength = chunk.length;
      if (readDataLength < firstStartPos && firstStartPos > chunkLength) {
        readDataLength += chunkLength;
        writable.write(chunk);
      } else {
        let startPosCaret = readDataLength + firstStartPos;
        let data = '';
        data += chunk.slice(0, startPosCaret);
        data += variable;
        data += chunk.slice(startPosCaret + color.length);
        writable.write(data);
      }

      readable.pause();

      console.log('got %d bytes of data', chunk.length);
    });

    readable.on('end', () => {
      console.log('there will be no more data.');
      writable.end();
    });

    while (colorData.length > 0) {
      let first = colorData.shift();
      firstStartPos = first.startPos;
      color = first.color;
      readable.resume();
    }

    readable.resume();

  }

}

module.exports = router;
