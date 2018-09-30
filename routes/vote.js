let express = require('express');
let router = express.Router();

const connection = mysql.createConnection({
    host: process.env.NODE_DB_HOST,
    user: process.env.NODE_DB_USER,
    password: process.env.NODE_DB_PASSWORD,
    database: process.env.NODE_DB_DATABASE
  });

  //投票
  router.get( '/product/:id' , (req , res , next ) => {
    let id = req.params.id;
    connection.query('', [id] , ( err, row ) => {

    })
  });

  //投票ページ
  router.get( '/user/:id' , (req , res , next ) => {
    let id = req.params.id;
    let select = '`students`.`name`, `students`.`grade`, `students`.`major`, `products`.`concept`, `products`.`genre`, `products`.`id`';
    let from = '`students`, `products`';
    let where = '`products`.`representative_student_id` = `students`.`id` AND `products`.`id`';
    let sub = 'IN (SELECT `vote`.`product_id` FROM `vote` WHERE `vote`.`product_id` IN (SELECT `vote`.`product_id` FROM `vote` WHERE `vote`.`id` = ? ))';
    connection.query(`SELECT ${select} FROM ${from} WHERE ${where} ${sub}`, [id] , ( err, row ) => {

    })
  });
module.exports = router;