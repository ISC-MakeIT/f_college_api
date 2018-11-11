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
    getUserPhotos().then(
        photos => {

            let query = 'SELECT products.product_id, products.theme, products.genre, students.name, students.class FROM products, students WHERE products.leader_id = students.student_id'
            connection.query(query, (err, rows) => {
                let products = [];
                for (let i = 0; i < rows.length; i++) {
                    item=rows[i];
                    items = {
                        id: item.product_id,
                        title: item.theme,
                        genre: item.genre,
                        head_shot: photos[i].head_shot,
                        owner: {
                            name: item.name,
                            class: item.class,
                            profile_photo: photos[i].profile_photo
                        },
                    };
                    products.push(items);
                }
                res.header('Content-Type', 'application/json; charset=utf-8');
                res.json(products);
            });
        }
    );
});



const getUserPhotos = () => {

    return new Promise((resolve) => {
        let getPhotos = 'SELECT photos.photo_path, profile_photos.profile_photo_path FROM photos JOIN profile_photos ON photos.product_id = profile_photos.product_id GROUP BY photos.product_id;';
        connection.query(getPhotos, (err, row) => {
            let photos = [];
            for (let item of row) {
                let items = {};
                items = {
                    head_shot: item.photo_path,
                    profile_photo: item.profile_photo_path
                };
                photos.push(items);
            }
            resolve(photos);
        });
    });
}

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