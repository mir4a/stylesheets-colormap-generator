const fs = require('fs');
const path = require('path');
const colorRegexp = /(#[A-F\d]{3}\b|#[A-F\d]{6}\b)|(rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?([, \.\d]+)?\))/gi;
const variableMap = new Map();
const process = require('process');
const args = processArguments(process.argv);

var colorMap = new Map();
var fileCounter = 0;

// Adjust these constants for your needs
// Directory where to search for files
const dirToParse = '/app/assets/stylesheets/';
// File for color schema or one that should be skipped for search
const skipFile = '/app/assets/stylesheets/shared/colors.scss'
// Change LOCALHOST_OR_POW_APP_URL to url of your rails app on localhost
const xrayUrl = 'http://LOCALHOST_OR_POW_APP_URL/_xray/open?path=';

console.log(process.argv);

function processArguments( arg ) {
  return arg.length > 2 ? arg.splice(2) : dirToParse;
}


function searchForColorInFile(data, filePath) {
  var result = [];
  var test;
  var lines = data.split('\n');
  for (var i = 0, len = lines.length; i < len; i++) {
    var lineStr = `${filePath}:${i+1}:`;
    while (test = colorRegexp.exec(lines[i])) {
      addToMap(test[0], lineStr + (test.index + 1), colorMap);
      result.push(test[0]);
    }
  }
  return result;
}

function addToMap(color, place, map) {
  var normalizedColor = color.toLowerCase();
  var longColor = convertShortHEXtoLong(normalizedColor);
  if (map.has(longColor)) {
    var val = map.get(longColor);
    val.place.push(place);
    val.index = getColorIndex(longColor);
    map.set(longColor, val);
  } else {
    var val2 = {
      place: [],
      index: 0
    };
    val2.place.push(place);
    val2.index = getColorIndex(longColor);
    map.set(longColor, val2);
  }
  return map;
}

function pathType(path) {
  var stat = fs.statSync(path);
  var type;
  if (stat.isFile()) type = 'FILE';
  else if (stat.isDirectory()) type = 'DIRECTORY';
  else type = undefined;
  return type;
}

function processDir(path) {
  var files = [];
  if (typeof path === 'array') {
    for (var el of path) {
      files = fs.readdirSync(el);
      main(files, ela);
    }
  } else {
    files = fs.readdirSync(path);
    main(files, path);
  }
}

function main(files, dir) {
  dir = dir ? dir : dirToParse;
  var data,
      filePath,
      pType,
      colors;
  for (var file of files) {
    filePath = path.resolve(dir, file);
    pType = pathType(filePath);

    if (pType === 'FILE') {
      if (filePath === path.resolve(skipFile)) continue;
      data = fs.readFileSync(filePath, 'utf-8');
      colors = searchForColorInFile(data, filePath);
      countAndPrintProcessedFiles(filePath, colors);
    } else if (pType === 'DIRECTORY') {
      processDir(filePath);
    } else {
      console.log(`${filePath} is not file`);
    }

  }
}

function countAndPrintProcessedFiles(filePath, colors) {
  ++fileCounter;
  console.log(`${fileCounter}: ${filePath} — found ${colors.length} colors`);
  return fileCounter;
}

function mainHandler() {
  var start = new Date();
  var end, diff;
  processDir(dirToParse);
  printToHTMLColorMap(colorMap);
  end = new Date();
  diff = end - start;
  console.log(`Finished for ${diff}ms, found ${colorMap.size} colors`);
}

function printToHTMLColorMap(map) {
  const header = `
    <!doctype html>
    <html>
    <head>
    <title>${map.size} colors (${(new Date).toLocaleDateString()})</title>
    <style>
      body {
        padding: 0;
        margin: 0;
        font-size: 0;
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        align-items: center;
        align-content: center;
        background: repeating-linear-gradient( 135deg, #FFF, #FFF 9px, #000 9px, #000 11px);
        background-attachment: fixed;
      }
      .color b,
      .color i {
        pointer-events: none;
      }
      .color {
        font: italic 10px/1 arial;
        color: #333;
        text-align: center;
        display: flex;
        min-width: 200px;
        height: 40px;
        text-shadow: 1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff;
        flex: auto;
        flex-flow: row wrap;
        align-items: center;
        justify-content: space-around;
        align-content: center;
      }
      .color:hover {
        transform: scale(1.05);
      }
      .xray-link:visited {
        color: #777;
      }
      #modal {
        font-size: 14px;
        display: none;
        position: fixed;
        padding: 20px;
        top: 25%;
        left: 15%;
        right: 15%;
        bottom: 25%;
        background: rgba(250,250,250,0.95);
        overflow: auto;
        text-shadow: 0 1px 2px #fff, 0 -1px 2px #fff;
      }
      #close {
        position: absolute;
        right: 5px;
        top: 2px;
      }
    </style>
    </head>
    <body>
  `;
  const footer = `
    <script>
    document.addEventListener('click', toggleModal);
    document.addEventListener('keyup', escHandler);

    function toggleModal(e) {
      console.log(e);
      var modal = document.getElementById('modal');
      var modalContent = document.getElementById('modal-content');
      var modalTitle = document.getElementById('modal-title');
      var target = e.target;
      var title = target.title;
      var bg;
      if (target.id === 'close') {
        modal.style.display = 'none';
        modal.style.background = 'rgba(250,250,250,0.95)';
      } else if (target.className === 'color') {
        bg = target.style.background;
        modalContent.innerHTML = createLinkList(title);
        modal.style.display = 'block';
        modal.style.background = bg;
        modal.style.boxShadow = '0 12px 110px ' + bg;
        modalTitle.innerText = target.getElementsByTagName('b')[0].innerText;
      } else if (target.className === 'xray-link') {
        xrayHanlder(target.text);
      } else {
        modal.style.display = 'block';
      }
    }

    function escHandler(e) {
      var modal = document.getElementById('modal');
      console.log(e);
      if (e.keyCode === 27) {
        modal.style.display = 'none';
      }
    }

    function createLinkList(text) {
      var textArr = text.split('\\n');
      var tmp = '';
      for (var i = 0, len = textArr.length; i < len; i++) {
        tmp += '<a href="#' + textArr[i] + '" class="xray-link">' + textArr[i] + '</a><br>';
      }
      return tmp;
    }

    function xrayHanlder(path) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '${xrayUrl}' + path, false);
      xhr.send();

      if (xhr.status != 200) {
        console.error(xhr.status, xhr.statusText);
      } else {
        console.log(xhr.responseText);
      }
    }
    </script>
    <div id="modal">
      <small id="close">(esc)</small>
      <h5 id="modal-title"></h5>
      <pre id="modal-content"></pre>
    </div>
    </body>
    </html>
  `;

  var colors = '';
  var sortedColors = insertionSortForColors([...map.keys()], map);


  sortedColors.forEach((val)=>{
    colors += `
      <div
        class="color"
        style="background: ${val};"
        title="${map.get(val).place.join('\n')}">
        <b>${val}</b>
        <i>${map.get(val).index}</i>
      </div>
    `;
  });

  var data = header + colors + footer;

  return fs.writeFileSync('colors.html', data, 'utf-8');
}

function convertShortHEXtoLong(hex) {
  var tmp = '';
  if (hex && hex.length === 4) {
    tmp = hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  } else if (!hex) {
    return '#000000';
  } else {
    tmp = hex;
  }
  return tmp;
}

function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}


/**
 * Compare two numeric values
 * @param a
 * @param b
 * @returns {boolean}
 */
function compareTwoNumbers( a, b ) {
  return (a - b) > 0;
}

function compareTwoColorIndex( colorA, colorB ) {
  // console.log(`arA = ${arA}; arB = ${arB}`);
  var indexA = colorMap.get(colorA);
  var indexB = colorMap.get(colorB);
  if (indexA && indexB) {
    return (indexA.index - indexB.index) < 0;
  } else {
    return;
  }
}

/**
 * Swap tow elements in array
 * @param arr
 * @param posA
 * @param posB
 */
function swap( arr, posA, posB ) {
  var temp = arr[posA];
  arr[posA] = arr[posB];
  arr[posB] = temp;
}


/**
 * Returns new sorted array using Insertion Sort Algorithm
 * @param arr
 * @returns {Array|number}
 */
function insertionSort( array ) {
  var arr = array.slice();

  for (var i = 1; i <= arr.length; i++) {
    var currentPos = i;
    while (currentPos > 0 && compareTwoNumbers(parseInt(arr[currentPos - 1]), parseInt(arr[currentPos]))) {
      swap(arr, currentPos, currentPos - 1);
      currentPos -= 1;
    }
  }
  return arr;
}


/**
 * Returns new sorted array using Insertion Sort Algorithm
 * @param arr
 * @returns {Array|number}
 */
function insertionSortForColors( array, map ) {
  // console.log(array);
    var arr = array.slice();

  for (var i = 1; i <= arr.length; i++) {
    var currentPos = i;
    while (currentPos > 0 && compareTwoColorIndex(arr[currentPos - 1], arr[currentPos])) {
      swap(arr, currentPos, currentPos - 1);
      currentPos -=1;
    }
  }
  return arr;
}



function getColorIndex(color) {
  var index, hex;
  if (color && color[0] === '#') {
    index = getHEXValue(color);
  } else if (!color) {
    return 0;
  } else {
    hex = rgb2hex(color);
    index = getHEXValue(hex);
  }
  return index;
}

function getHEXValue(hex) {
  var bytes = hex.slice(1);
  var value = parseInt(bytes, 16);
  return isNaN(value) ? 0 : value;
}

mainHandler();
