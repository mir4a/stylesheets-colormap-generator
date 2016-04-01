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


/* GET settings. */
router.post('/', (req, res, next) => {

  let settingsFile = path.resolve(req.body['project-path'], config.settingsFileName);
  req.app.locals.colormapProject = req.body['project-path'];

  checkSettingsFile(settingsFile)
    .then(
      fileName => {
        return getFileData(fileName);
      }
    )
    .then(
      data => {
        let settings = JSON.parse(data);
        return settings;
      }
    )
    .then(
      settings => {
        req.app.locals.colormapSettings = settings;
        res.redirect('/colors');
      }
    )
    .catch(error => {
      console.error(error);
      res.locals.flash = {
        type: 'error',
        message: 'No settings file'
      };
      res.render('index');
    });

});

/*
Save Stylesheets path into settings file
 */
router.post('/stylesheets', (req, res, next) => {
  let stylesPath = path.resolve(req.app.locals.colormapProject, req.body['stylesheets-path']);
  console.log(stylesPath);
  if (!req.app.locals.colormapSettings['stylesheets-path']) {
    req.app.locals.colormapSettings['stylesheets-path'] = req.body['stylesheets-path'];
  }

  // FIXME: WTF?

});

module.exports = router;
