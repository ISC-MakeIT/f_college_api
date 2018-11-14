const express = require("express");
const router = express.Router();
const connection = require("../../dbConnection");

// https://fc-fb-live.com/api/products/
router.get('/', (req, res) => {
    let products = {};
    const query = 'SELECT ' +
        'products.product_id, ' +
        'products.genre, ' +
        'products.entry_order, ' +
        'products.product_number, ' +
        'students.student_id, ' +
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
        let fashion_products = [];
        let beauty_products = [];
        let items = {};
        for (let item of rows) {
            items = {
                product_id: item.product_id,
                entry_order: item.entry_order,
                product_number: item.product_number,
                title: item.title,
                head_shot: item.photo_path,
                owner: {
                    student_id: item.student_id,
                    profile_photo: item.profile_photo_path,
                    student_name: item.name,
                    student_class: item.class,
                    leader_flg: false,
                }
            };

            if (item.genre === 'BEAUTY') {
                beauty_products.push(items);
            }
            if (item.genre === 'FASHION') {
                fashion_products.push(items);
            }
        }
        products.fashion = fashion_products;
        products.beauty = beauty_products;
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.json(products);
    });
});

// https://fc-fb-live.com/api/products/1
router.get('/:id', (req, res) => {
    let product = {};
    let query_for_products = 'SELECT ' +
        'products.product_id, ' +
        'products.genre, ' +
        'products.theme, ' +
        'products.concept ' +
        'FROM products ' +
        'WHERE products.product_id = ?';
    query_for_products = mysql.format(query_for_products, req.params.id);

    connection.query(query_for_products, (err, caption) => {
        product = {
            product_id: caption[0].product_id,
            genre: caption[0].genre,
            theme: caption[0].theme,
            concept: caption[0].concept
        };

        let query_for_photos = 'SELECT ' +
            'products.product_id, ' +
            'photos.photo_path ' +
            'FROM ' +
            'products ' +
            'JOIN ' +
            'photos ON products.product_id = photos.product_id ' +
            'WHERE ' +
            'products.product_id= ?';
        query_for_photos = mysql.format(query_for_photos, req.params.id);

        connection.query(query_for_photos, (err, photo) => {
            let photos = [];
            for (let item of photo) {
                photos.push(item.photo_path);
            }
            product.photos = photos;

            let query_for_members = 'SELECT ' +
                'products.product_id, ' +
                'product_members.student_id, ' +
                'students.name,students.class, ' +
                'profile_photos.profile_photo_path, ' +
                'product_members.leader_flg ' +
                'FROM ' +
                'products ' +
                'JOIN ' +
                'product_members ON products.product_id = product_members.product_id ' +
                'JOIN ' +
                'students ON product_members.student_id = students.student_id ' +
                'JOIN profile_photos ON products.product_id = profile_photos.product_id ' +
                'WHERE ' +
                'products.product_id= ?';
            query_for_members = mysql.format(query_for_members, req.params.id);

            connection.query(query_for_members, (err, member) => {
                let members = [];
                for (let item of member) {
                    let items = {};
                    items = {
                        student_id: item.student_id,
                        profile_photo: item.profile_photo_path,
                        student_name: item.name,
                        student_class: item.class,
                        leader_flg: false,
                    };
                    if (item.leader_flg === 1) {
                        items.leader_flg = true;
                    }
                    members.push(items);
                }
                product.members = members;

                res.set('Content-Type', 'application/json; charset=utf-8');
                res.json(product);
            });
        });
    });
});

module.exports = router;
