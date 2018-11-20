const express = require('express');
const router = express.Router();

const connection = require('../../dbConnection');
const scheme = require('./scheme');

//投票API

router.get('/:genre', (req, res) => {
  // todo ジャンルを指定してtop10の順位、作品番号、作品名、代表者名、メンバー一覧、作品写真を取得する
  console.log('ranking');
  res.send('ranking');

    // const genre = req.params.genre;
	  // const query = scheme['/:genre'].GET(genre).getQuery();
    // const table = scheme['/:genre'].GET(genre).getTable();
	  // connection.promise().query(query, table);
        // .then((row) => {
        //     console.log(row);
        //     console.log(`Increment vote:${id}`);
        //     res.header('Content-Type', 'application/json; charset=utf-8');
        //     res.status(200).send({
        //         'message': `Success to vote ${id}`
        //     });
        // })
        // .catch((err) => {
        //     console.error(`DB Error:${err}`);
        //     res.status(500).send(`DB Error,failed to vote ${id}. please check log file`);
        // });
});