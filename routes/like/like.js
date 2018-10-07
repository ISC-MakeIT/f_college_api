const express = require('express');
const router = express.Router();
//const mysql = require('mysql2');
require('dotenv').config();

// const connection = mysql.createConnection({
//     host: process.env.NODE_DB_HOST,
//     user: process.env.NODE_DB_USER,
//     password: process.env.NODE_DB_PASSWORD,
//     database: process.env.NODE_DB_DATABASE
// });

// =>app.use('/api/:id/like', LikeRouter);

// router.get('/', (err, req, res) => {
//     res.send('like');
// });

module.exports = router;