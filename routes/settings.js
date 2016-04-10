'use strict';

var express = require('express');
var router = express.Router();
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


/**
 * Save settings
 * @param  {[type]} '/'   [description]
 * @param  {[type]} (req, res,          next [description]
 * @return {[type]}       [description]
 */
router.post('/', (req, res, next) => {

  let projectPath = req.body['project-path'];
  let stylesheetsPath = path.resolve(projectPath, req.body['stylesheets-path']);
  let schemePath = path.resolve(projectPath, req.body['scheme-path']);
  let editor = req.body['editor'];

  req.app.locals.colormapSettings = {
    projectPath: projectPath,
    stylesheetsPath: stylesheetsPath,
    schemePath: schemePath,
    editor: editor
  };

  res.redirect('/colors');
});


module.exports = router;
