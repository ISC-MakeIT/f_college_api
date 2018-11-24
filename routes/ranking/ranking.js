const express = require('express');
const router = express.Router();

const connection = require('../../dbConnection');
// const scheme = require('./scheme');
const mysql = require("mysql2");

// https://fc-fb-live.com/api/ranking
router.get('/', (req, res) => {
    res.send('ranking');
});

//   let product = {};
//   const query_for_products = 'SELECT ' +
//     'products.product_id, ' +
//     'products.entry_order, ' +
//     'products.genre, ' +
//     'products.theme, ' +
//     'products.concept, ' +
//     'vote.number_of_votes, ' +
//     'from ' +
//     'products ' +
//     'join vote on products.product_id = vote.product_id ' +
//     'join students on products.leader_id = students.student_id ' +
//     'order by vote.number_of_votes desc ' +
//     'limit 10';

//   connection.query(query_for_products, (err, caption) => {
//     let captions = [];
//     let items = {};
//     for (let item of caption) {
//       items = {
//         // No.: caption.indexOf(item),
//         product_id: item.product_id,
//         entry_order: item.entry_order,
//         genre: item.genre,
//         theme: item.theme,
//         concept: item.concept,
//         number_of_votes: item.number_of_votes,
//       };
//       captions.push(items);
//     }
//     product.caption = captions;
//     const query_for_photos = 'select ' +
//       'photos.photo_path, ' +
//       'profile_photos.profile_photo_path, ' +
//       'from ' +
//       'photos, ' +
//       'profile_photos, ' +
//       'vote ' +
//       'where ' +
//       'photos.product_id=profile_photos.product_id ' +
//       'and ' +
//       'photos.product_id = vote.product_id ' +
//       'group by photos.product_id ' +
//       'order by vote.number_of_votes desc ' +
//       'limit 10';

//     connection.query(query_for_photos, (err, photo) => {
//       let photos = [];
//       for (let item of photo) {
//         let items = {};
//         items = {
//           head_shot: item.photo_path,
//           profile_photo: item.profile_photo_path
//         };
//         photos.push(items);
//       }
//       product.photos = photos;
//       const query_for_members = 'select ' +
//         'product_members.student_id, ' +
//         'students.class, ' +
//         'students.name, ' +
//         'product_members.leader_flg, ' +
//         'from ' +
//         'products ' +
//         'join ' +
//         'product_members ' +
//         'on products.product_id = product_members.product_id ' +
//         'join ' +
//         'students ' +
//         'on product_members.student_id = students.student_id ' +
//         'join ' +
//         'vote ' +
//         'on products.product_id=vote.product_id ' +
//         'order by  ' +
//         'vote.number_of_votes desc, ' +
//         'product_members.product_id';

//       connection.query(query_for_members, (err, member) => {
//         let members = [];
//         for (let item of member) {
//           let items = {};
//           items = {
//             student_id: item.student_id,
//             student_class: item.class,
//             student_name: item.name,
//             leader_flg: leader_flg
//           };
//           // if (item.leader_flg === 1) {
//           //   items.leader_flg = true;
//           // }
//           members.push(items);
//         }
//         product.members = members;
//         res.header('Content-Type', 'application/json; charset=utf-8');
//         res.status(200).json(product);
//       });
//     });
//   });
// });


// // router.get('/:genre', (req, res) => {
// //   // todo ジャンルを指定してtop10の順位、作品番号、作品名、代表者名、メンバー一覧、作品写真を取得する
// //   console.log('ranking');
// //   res.send('ranking');

// //     // const genre = req.params.genre;
// // 	  // const query = scheme['/:genre'].GET(genre).getQuery();
// //     // const table = scheme['/:genre'].GET(genre).getTable();
// // 	  // connection.promise().query(query, table);
// //         // .then((row) => {
// //         //     console.log(row);
// //         //     console.log(`Increment vote:${id}`);
// //         //     res.header('Content-Type', 'application/json; charset=utf-8');
// //         //     res.status(200).send({
// //         //         'message': `Success to vote ${id}`
// //         //     });
// //         // })
// //         // .catch((err) => {
// //         //     console.error(`DB Error:${err}`);
// //         //     res.status(500).send(`DB Error,failed to vote ${id}. please check log file`);
// //         // });
// // });