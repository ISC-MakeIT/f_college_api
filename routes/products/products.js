const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.NODE_DB_HOST,
    user: process.env.NODE_DB_USER,
    password: process.env.NODE_DB_PASSWORD,
    database: process.env.NODE_DB_DATABASE
});

router.get('/', (req, res) => {
    const sql = '\
        SELECT\
            photos.photo_url,\
            students.name,\
            students.major,\
            students.grade,\
            students.profile_photo_url,\
            products.id,\
            products.genre,\
            products.title\
        FROM\
            photos,\
            products,\
            students\
        WHERE\
            products.id = photos.product_id\
        AND\
            students.id = products.representative_student_id';

    connection.query(sql, (err, row) => {
        const json = [];
        for (let obj of row) {
            let products = {};
            products = {
                type: obj.major,
                image_url: obj.photo_url,
                owner: {
                    name: obj.name,
                    subject: `${obj.major} ${obj.grade}`,
                    image_url: obj.profile_photo_url
                }
            };
            json.push(products);
        }
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.json(json);
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const sql = '\
        SELECT\
            products.id,\
            products.concept,\
            photos.photo_url\
        FROM\
            products,\
            photos\
        WHERE\
            products.id = photos.product_id\
        AND\
            products.id = ?';

    connection.query(sql, [id], (err, row) => {
        const json = [];
        const image_url = [];
        let product = {};
        product = {
            id: row[0].id,
            concept: row[0].concept
        };
        for (let photo of row) {
            image_url.push( photo.photo_url);
        }
        product = {
            sub_image_urls: image_url
        };
        json.push(product);

        const sql_sub = '\
            SELECT\
                students.name,\
                students.major,\
                students.grade,\
                students.profile_photo_url,\
                students.message\
            FROM\
                students\
            WHERE\
                students.id\
            IN(\
                SELECT\
                    product_menbers.student_id\
                FROM\
                    product_menbers\
                WHERE\
                product_menbers.product_id = ? \
            )';

        connection.query(sql_sub, [id], (err, row) => {            
            let owner = {};
            let member = {};
            const team = [];
            owner = {
                name: row[0].name,
                subject: `${row[0].major} ${row[0].grade}`,
                message: row[0].message,
                image_url: row[0].profile_photo_url
            };
            product.owner = owner;
            for (let members of row) {
                member = {
                    name: members.name,
                    subject: `${ members.major } ${ members.grade }`,
                    message: members.message,
                    image_url: members.profile_photo_url,
                };
                team.push(member);
                member = {};
            }
            product.member = team;
            res.header('Content-Type', 'application/json; charset=utf-8');
            res.json(json);
        });
    });
});

module.exports = router;