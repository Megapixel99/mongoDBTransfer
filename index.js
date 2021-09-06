// written by Seth Wheeler
const express = require('express');
const path = require('path');

const dbCopy = require('./dbCopy.js');

const app = express();

app.set('json spaces', 2);

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

app.post('/sync', (req, res) => {
  res.sendStatus(202);
  dbCopy();
});

app.listen(3000);
