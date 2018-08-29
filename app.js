// ###### Sun Jul 29 15:11:51 JST 2018
'use strict';
const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const PORT = process.env.PORT || 4000;
const debug = require('debug')('app:server');
const http = require('http');


app.use('/', express.static(path.join(__dirname, 'views')));
// app.set('public', __dirname + '/public');
app.set('view engine', 'ejs');
const server = app.listen(PORT, function () {
    console.log('http://localhost:' + server.address().port);
});



app.get('/', (req, res, next) => {
    res.send('hello node');
});
