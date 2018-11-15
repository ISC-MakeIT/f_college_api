const express = require('express');
const router = express.Router({
    mergeParams: true
});

const connection = require('../../dbConnection');
const scheme = require('./scheme');

//投票API

router.post('/', (req, res) => {
    res.header('Content-Type', 'application/json; charset=utf-8');

    const id = req.params.id;
    const query = scheme['/'].POST(id).getQuery();
    const table = scheme['/'].POST(id).getTable();

    connection.promise().query(query, table)
        .then((row) => {
            console.log(`Increment vote:${id}`);
            res.status(200).send(`Success to vote ${id}`);
        })
        .catch((err)=> {
            console.error(`DB Error:${err}`);
            res.status(500).send(`DB Error,failed to vote ${id}. please check log file`);
        });
});

router.delete('/', (req, res) => {
    res.header('Content-Type', 'application/json; charset=utf-8');

    const id = req.params.id;
    const query = scheme['/'].DELETE(id).getQuery();
    const table = scheme['/'].DELETE(id).getTable();

    connection.promise().query(query, table)
        .then((row) => {
            console.log(`Decrement vote:${id}`);
            res.status(200).send(`Success to remove vote ${id}`);
        })
        .catch((err)=> {
            console.error(`DB Error:${err}`);
            res.status(500).send(`DB Error,failed to remove vote ${id}. please check log file`);
        });
});

module.exports = router;
