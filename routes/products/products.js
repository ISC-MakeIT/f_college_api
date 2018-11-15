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

// https://fc-fb-live.com/api/products/
router.get('/', (req, res) => {
    let products = [];
    let fashion = {};
    let beauty = {};
    let fashion_products = [];
    let beauty_products = [];
    const query = 'SELECT ' +
        'products.product_id, ' +
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

    connection.query(query, (err, rows) => {
        for (let item of rows) {
            let items = {};
            items = {
                product_id: item.product_id,
                entry_order: item.entry_order,
                product_number: item.product_number,
                title: item.title,
                head_shot: item.photo_path,
                owner: {
                    profile_photo: item.profile_photo_path,
                    student_name: item.name,
                    student_class: item.class
                }
            };
            if (item.genre === 'BEAUTY') {
                beauty_products.push(items);
            }
            if (item.genre === 'FASHION') {
                fashion_products.push(items);
            }
        }
        fashion.fashion = fashion_products;
        beauty.beauty = beauty_products;
        products.push(fashion);
        products.push(beauty);
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.json(products);
    });
});

// https://fc-fb-live.com/api/products/1
router.get('/:id', (req, res) => {
    productDetail().then(
        product => {
            console.log("bbbbbbbbbbbbbbbbbb");
            console.log(toString.call(product));
            console.log();
            res.set('Content-Type', 'application/json; charset=utf-8');
            var a = JSON.stringify(product);
            res.json(a);
        }
    );
});

const productDetail = () => {
    return new Promise((resolve) => {
        let product = [];
        let data={};
        product.data=data;
        const query_for_products = 'SELECT ' +
            'products.product_id, ' +
            'products.genre, ' +
            'products.theme, ' +
            'products.concept ' +
            'FROM products ' +
            'WHERE products.product_id = 1';

        connection.query(query_for_products, (err, caption) => {
            let captions=[];
            let items = {};
            for (let item of caption) {
                items = {
                    product_id: item.product_id,
                    genre: item.genre,
                    theme: item.theme,
                    concept: item.concept
                };
                captions.push(items);
            }
            product.data=captions;
            const query_for_photos = 'SELECT ' +
                'products.product_id, ' +
                'photos.photo_path ' +
                'FROM ' +
                'products ' +
                'JOIN ' +
                'photos ON products.product_id = photos.product_id ' +
                'WHERE ' +
                'products.product_id=1';

            connection.query(query_for_photos, (err, photo) => {
                let photos = [];
                for (let item of photo) {
                    let items = {};
                    items = {
                        photo_path: item.photo_path
                    };
                    photos.push(items);
                }
                product.photos = photos;
                const query_for_menbers = 'SELECT ' +
                    'products.product_id, ' +
                    'product_members.student_id, ' +
                    'students.name,students.class ' +
                    'FROM ' +
                    'products ' +
                    'JOIN ' +
                    'product_members ON products.product_id = product_members.product_id ' +
                    'JOIN ' +
                    'students ON product_members.student_id = students.student_id ' +
                    'WHERE ' +
                    'products.product_id=1';

                connection.query(query_for_menbers, (err, menber) => {
                    console.log(menber);
                    let menbers = [];
                    for (let item of menber) {
                        let items = {};
                        items = {
                            student_id: item.student_id,
                            student_name: item.name,
                            student_class: item.class
                        };
                        menbers.push(items);
                    }
                    product.menbers = menbers;
                    console.log("aaaaaaaaaaaaaaaaa");
                    console.log(product);
                    resolve(product);
                });
            });
        });
    });
}

module.exports = router;