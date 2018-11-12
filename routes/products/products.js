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

/* DB接続チェック用 */
// router.get('/', (req, res) => {
//     const sql = '\
//     SELECT * FROM students;';
//     connection.query(sql, (err, row) => {
//         console.log(row);
//     });
// });


// https://fc-fb-live.com/api/products/
router.get('/', (req, res) => {
    const query = 'SELECT ' +
        'products.genre, ' +
        'products.entry_order, ' +
        'products.product_number, ' +
        'students.name, ' +
        'students.class, ' +
        'photos.photo_path, ' +
        'profile_photos.profile_photo_path ' +
        'FROM photos ' +
        'JOIN profile_photos ON photos.product_id = profile_photos.product_id ' +
        'JOIN products ON profile_photos.product_id = products.product_id ' +
        'JOIN students ON products.leader_id = students.student_id ' +
        'GROUP BY products.product_id ' +
        'ORDER BY products.genre desc, products.entry_order ASC ';

    connection.query(query, (err, row) => {
        let products = [];
        let fashion = {};
        let beauty = {};
        let fashion_products = [];
        let beauty_products = [];
        for (let item of row) {
            let items = {};
            items = {
                entry_order: item.entry_order,
                id: item.product_number,
                title: item.title,
                head_shot: item.photo_path,
                profile_photo: item.profile_photo_path,
                student_name: item.name,
                student_class: item.class
            }
            if (item.genre === 'FASHION') {
                // fashion_products.push(items);
                fashion_products.push(items);
            }
            if (item.genre === 'BEAUTY') {
                beauty_products.push(item);
            }
        }
        fashion.fashion = fashion_products;
        beauty.beauty = beauty_products;
        products.push(fashion);
        products.push(beauty);
        console.log(1);
        console.log(products[0].fashion[2].profile_photo);
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.json(products);
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
            image_url.push(photo.photo_url);
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