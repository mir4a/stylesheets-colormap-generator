'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const config = require('../config/settings');


/**
 * [checkSettingsFile description]
 * @param  {[type]} filePath [description]
 * @return {[type]}          [description]
 */
function checkSettingsFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) =>{
      if (err) {
        reject(err);
      } else if (stats.isFile()) {
        resolve(filePath);
      } else {
        reject(new Error('Not a file'));
      }
    });
  });
}

/**
 * [getFileData description]
 * @param  {[type]} filePath [description]
 * @return {[type]}          [description]
 */
function getFileData(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}


/**
 * [checkDir description]
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function checkDir(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.isDirectory()) {
        resolve(path);
      } else {
        reject(new Error('Not a Directory'));
      }
    });
  });
}

function isDir(path) {
  let stat = fs.statSync(path);
  return stat.isDirectory();
}

var dirStructureMarkup = '';

function printFilesStrucureRecursiveHelper(dir) {
  let dirStructure = fs.readdirSync(dir);
  while (dirStructure.length > 0) {
    let name = dirStructure.shift();
    if (name[0] === '.') {
      continue;
    }

    let fullPath = path.resolve(dir, name);

    if (isDir(fullPath)) {
      dirStructureMarkup += `<li class="subdir"><a class="dir" href="${fullPath}">${name}</a><ul>`;
      printFilesStrucureRecursiveHelper(fullPath);
      dirStructureMarkup += `</ul>`;
    } else {
      dirStructureMarkup += `<li><a class="file" href="${fullPath}">${name}</a></li>`;
    }
  }

  return dirStructureMarkup;
}

function printFilesStrucure(dir) {
  dirStructureMarkup = '<ul class="dir-list">';
  printFilesStrucureRecursiveHelper(dir);
  dirStructureMarkup += '</ul>';
  return dirStructureMarkup;
}


/**
 * Save settings
 * @param  {[type]} '/'   [description]
 * @param  {[type]} (req, res,          next [description]
 * @return {[type]}       [description]
 */
router.post('/', (req, res, next) => {

  let stylesheetsPath = req.body['stylesheets-path'];
  let schemePath = req.body['scheme-path'];
  let skipFiles = req.body['skip-files'];
  let editor = req.body['editor'];

  if (!stylesheetsPath) {
    res.render('index', {
      title: 'Colormap',
      flash: {
        type: 'error',
        message: 'Please provide path to stylesheets'
      },
    });
  }

  req.app.locals.colormapSettings = {
    stylesheetsPath: stylesheetsPath,
    schemePath: schemePath,
    skipFiles: skipFiles,
    editor: editor
  };

  res.redirect('/settings');
});

router.get('/', (req, res, next) => {
  let colormapSettings = req.app.locals.colormapSettings;

  if (colormapSettings) {
    let stylesheetsPath = colormapSettings.stylesheetsPath;
    let html = printFilesStrucure(stylesheetsPath);
    res.render('settings', { title: `Settings`, html: html, colormapSettings: colormapSettings});
  } else {
    res.redirect('/');
  }
});


module.exports = router;
