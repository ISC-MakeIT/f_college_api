const express = require('express');
const router = express.Router({
    mergeParams: true
});
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.NODE_DB_HOST,
    user: process.env.NODE_DB_USER,
    password: process.env.NODE_DB_PASSWORD,
    database: process.env.NODE_DB_DATABASE
});

//投票ページ
router.get('/', (req, res, next) => {
    const id = req.params.id;
    const sql = '\
        SELECT\
            `students`.`name`,\
            `students`.`grade`,\
            `students`.`major`,\
            `products`.`concept`,\
            `products`.`genre`,\
            `products`.`id`,\
            `students`.`profile_photo_url`\
        FROM\
            `students`, `products`\
        WHERE\
            `products`.`representative_student_id` = `students`.`id`\
        AND\
            `products`.`id`\
        IN(\
            SELECT\
                `vote`.`product_id`\
            FROM\
                `vote`\
            WHERE\
                `vote`.`product_id`\
            IN (\
                SELECT\
                    `vote`.`product_id`\
                FROM\
                    `vote`\
                WHERE\
                    `vote`.`voter_id` = ?\
            )\
        )';

    connection.query(sql, [id], (err, row) => {
        console.error(err);
        const jsonVote = [];
        let vote = {};
        for (let obj of row) {
            vote = {
                id: obj.id,
                genre: obj.genre,
                concept: obj.concept,
                owner: {
                    name: obj.name,
                    subject: `${obj.major} ${obj.grade}`,
                    image_url: obj.profile_photo_url
                }
            };
            jsonVote.push(vote);
        }
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.json(jsonVote);
    });
});
module.exports = router;