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
    let startPosMap = groupColorDataByFile(colorObj.meta);
    handleEditFiles(startPosMap, mergeTo, color);
  }

}

function groupColorDataByFile(meta) {
  var map = new Map();
  for (let i in meta) {
    if (map.has(meta[i].filePath)) {
      let startPos = map.get(meta[i].filePath);
      startPos.push(meta[i].startPos);
      map.set(meta[i].filePath, startPos);
    } else {
      let startPos = [meta[i].startPos];
      map.set(meta[i].filePath, startPos);
    }
  }
  return map;
}

function handleEditFiles(startPosMap, variable, color) {
  //FIXME: One file with multiple needle occurrences should be read>write in one cycle

  for (let filePath of startPosMap.keys()) {
    let startPosArr = startPosMap.get(filePath);
    let fileName = path.basename(filePath);
    let fileDir = path.dirname(filePath);
    let readable = fs.createReadStream(filePath, 'utf-8');
    let writable = fs.createWriteStream(path.resolve(fileDir, fileName + '.tmp'));
    let readDataLength = 0;
    let firstStartPos = 0;
    readable.pause();

    writable.on('error', (err)=> {
      console.log(`write to ${filePath} raised error`);
      console.error(err);
    });

    writable.on('finish', ()=> {
      console.log(`write to ${filePath} is finished`);
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

    while (startPosArr.length > 0) {
      firstStartPos = startPosArr.shift();
      readable.resume();
    }

    readable.resume();

  }

}

module.exports = router;
