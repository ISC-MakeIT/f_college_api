const express = require('express');
const router = express.Router({
    mergeParams: true
});

const connection = require('../../dbConnection');
const scheme = require('./scheme');

const mysql = require("mysql2");

//投票API

router.post('/:id', (req, res) => {
    const id = req.params.id;
	
    const query = scheme['/:id'].POST([id]).getQuery();
    const table = scheme['/:id'].POST([id]).getTable();
    
    console.log(table);
    console.log(mysql.format(query,table));

    connection.promise().query(query, table)
        .then((row) => {
            console.log(`Increment vote:${id}`);
            res.header('Content-Type', 'application/json; charset=utf-8');
            res.status(200).send({
                'message': `Success to vote ${id}`
            });
        })
        .catch((err) => {
            console.error(`DB Error:${err}`);
            res.status(500).send(`DB Error,failed to vote ${id}. please check log file`);
        });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    const query = scheme['/:id'].DELETE([id]).getQuery();
    const table = scheme['/:id'].DELETE([id]).getTable();

    connection.promise().query(query, table)
        .then((row) => {
            console.log(`Decrement vote:${id}`);
            res.header('Content-Type', 'application/json; charset=utf-8');
            res.status(200).send({
                'message': `Success to remove vote ${id}`
            });
        })
        .catch((err) => {
            console.error(`DB Error:${err}`);
            res.status(500).send(`DB Error,failed to remove vote ${id}. please check log file`);
        });
});

module.exports = router;
