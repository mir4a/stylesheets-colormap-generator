'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const spawn = require('child_process').spawn;

router.get('/', (req, res, next) => {
  let filePath = req.query.open;
  let editor = req.app.locals.colormapSettings.editor;

  // TODO: Add helper which will set different params that
  // let different editors open file on particular line and particular caret place
  var editorProcess = spawn(editor, [filePath]);

  editorProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  editorProcess.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  editorProcess.on('close', (code) => {
    console.log(`child process exited with code: ${code}`);
  });

  res.send('ok');

});

module.exports = router;
