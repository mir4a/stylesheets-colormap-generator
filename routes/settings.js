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
    let fullPath = path.resolve(dir, name);

    if (isDir(fullPath)) {
      dirStructureMarkup += ` <li class="subdir">\n<a href="${fullPath}">${name}</a>\n<ul>`;
      printFilesStrucureRecursiveHelper(fullPath);
      dirStructureMarkup += `</ul>`;
    } else {
      dirStructureMarkup += ` <li>\n<a href="${fullPath}">${name}</a></li>\n`;
    }
  }

  return dirStructureMarkup;
}

function printFilesStrucure(dir) {
  // TODO: Print dir str with markup
  dirStructureMarkup = '<ul>\n';
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
  let schemePath = path.resolve(stylesheetsPath, req.body['scheme-path']);
  let editor = req.body['editor'];
  console.log(schemePath);

  if (!req.body['scheme-path']) {
    let html = printFilesStrucure(stylesheetsPath);
    res.render('settings', { title: `Dir`, html: html});
  }

  req.app.locals.colormapSettings = {
    stylesheetsPath: stylesheetsPath,
    schemePath: schemePath,
    editor: editor
  };

  res.redirect('/colors');
});


module.exports = router;
