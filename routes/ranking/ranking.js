const express = require('express');
const router = express.Router();
const connection = require('../../dbConnection');
const scheme = require('./scheme');

router.get('/', async (req, res) => {
    Promise.all([top10ListFashion(), top10ListBeauty()]).then((results) => {
        console.log(results);
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.status(200).json(results);
    });
});

const top10ListFashion = () => {
    return new Promise((resolve, reject) => {
        const top_10_list_fashion = {};
        const query_for_top10 = 'SELECT  ' +
            'products.product_id, ' +
            'products.entry_order, ' +
            'products.genre, ' +
            'products.theme, ' +
            'students.student_id, ' +
            'students.name, ' +
            'vote.number_of_votes ' +
            'from ' +
            'products ' +
            'join students on products.leader_id=students.student_id ' +
            'join vote on products.product_id = vote.product_id  ' +
            'where products.genre="FASHION" ' +
            'order by vote.number_of_votes desc  ' +
            'limit 10;';

        connection.query(query_for_top10, (err, products) => {
            const list = [];
            let ranking_number = 0;
            let items = {};
            for (let item of products) {
                ranking_number++;
                items = {
                    ranking: ranking_number,
                    vote: 0,
                    product_id: item.product_id,
                    entry_order: item.entry_order,
                    genre: item.genre,
                    theme: item.theme,
                    student_id: item.student_id,
                    leader_name: item.name
                };
                if (item.number_of_votes > 0) {
                    items.vote = item.number_of_votes;
                }
                list.push(items);
            }
            top_10_list_fashion.fashion_ranking = list;
            resolve(top_10_list_fashion);
        });
    });
}

const top10ListBeauty = () => {
    return new Promise((resolve, reject) => {
        const top_10_list_beauty = {};
        const query_for_top10 = 'SELECT  ' +
            'products.product_id, ' +
            'products.entry_order, ' +
            'products.genre, ' +
            'products.theme, ' +
            'students.student_id, ' +
            'students.name, ' +
            'vote.number_of_votes ' +
            'from ' +
            'products ' +
            'join students on products.leader_id=students.student_id ' +
            'join vote on products.product_id = vote.product_id  ' +
            'where products.genre="BEAUTY" ' +
            'order by vote.number_of_votes desc  ' +
            'limit 10;';

        connection.query(query_for_top10, (err, products) => {
            const list = [];
            let ranking_number = 0;
            let items = {};
            for (let item of products) {
                ranking_number++;
                items = {
                    ranking: ranking_number,
                    vote: 0,
                    product_id: item.product_id,
                    entry_order: item.entry_order,
                    genre: item.genre,
                    theme: item.theme,
                    student_id: item.student_id,
                    leader_name: item.name
                };
                if (item.number_of_votes > 0) {
                    items.vote = item.number_of_votes;
                }
                list.push(items);
            }
            top_10_list_beauty.beauty_ranking = list;
            resolve(top_10_list_beauty);
        });
    });
}

module.exports = router;