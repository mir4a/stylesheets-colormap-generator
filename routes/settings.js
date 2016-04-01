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


/* GET settings. */
router.post('/', function(req, res, next) {

  var settingsFile = path.resolve(req.body['project-path'], config.settingsFileName);
  console.log(settingsFile);

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
      settigns => {
        res.send(settigns);
      }
    )
    .catch(error => {
      res.locals.flash = {
        type: 'error',
        message: 'No settings file'
      };
      res.render('index');
    });

});

module.exports = router;
