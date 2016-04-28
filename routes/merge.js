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

  res.redirect('/colors');
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
    let chunkOffset = 0;
    let firstStartPos = 0;
    let color = null;

    writable.on('error', (err)=> {
      console.log(`write to ${filePath} raised error`);
      console.error(err);
    });

    writable.on('finish', ()=> {
      fs.rename(path.resolve(fileDir, fileName + '.tmp'), filePath, ()=> {
        console.log(`Edited ${fileDir}`);
      });
    });

    readable.read();

    readable.on('data', (chunk) => {
      let chunkLength = chunk.length;
      let first = colorData[0];
      let subChunk = chunk;
      firstStartPos = first.startPos;
      color = first.color;

      if (chunkOffset < firstStartPos && firstStartPos > chunkLength) {
        chunkOffset += chunkLength;
        writable.write(chunk);
      } else {

        while (subChunk = processingChunk(chunk.slice(chunkOffset), colorData, variable, chunkOffset)) {
          writable.write(subChunk);
          if (colorData[0]) {
            chunkOffset = colorData[0].startPos;
          }
        }

      }

      console.log('got %d bytes of data', chunk.length);
    });

    readable.on('end', () => {
      console.log('there will be no more data.');
      writable.end();
    });

  }

}

function processingChunk(chunk, stopsQueue, joinString, offset) {
  //FIXME: found bug:
  // -  background-image: -webkit-linear-gradient(270deg, #000, #000);
  // -  background-image: linear-gradient(180deg, #000, #000);
  // -  color: #000;
  // +  background-image: -webkit-linear-gradient(270deg, #000, #000);$color-jet-black, $color-jet-black);
  // +  background-image: linear-gradient(180deg, $color-jet-black, $color-jet-black);
  // +  color: $color-jet-black;


  if (stopsQueue.length === 0) {
    return false;
  }

  let first = stopsQueue.shift();
  let before = first.startPos - offset;
  let after = stopsQueue[0] ? stopsQueue[0].startPos - offset : null;
  let result = '';

  if (before <= chunk.length - 1) {

    if (after) {
      if (before) {
        result += chunk.slice(0, before);
      }
      result += joinString;
      result += chunk.slice(before + first.color.length, after);
    } else {
      if (before) {
        result += chunk.slice(0, before);
      }
      result += joinString;
      result += chunk.slice(before + first.color.length);
    }

  } else {
    result = null;
  }

  return result;
}

module.exports = router;
