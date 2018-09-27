var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();


const connection = mysql.createConnection({
  host: process.env.NODE_DB_HOST,
  user: process.env.NODE_DB_USER,
  password: process.env.NODE_DB_PASSWORD,
  database: process.env.NODE_DB_DATABASE
});

// ://products
router.get('/', (req, res, next)=> {
  res.header('Content-Type', 'text/html; charset=utf-8');
  res.render('index', { title: 'Express' });
});

// router.get('/',(req,res,next)=>{
//   res.header('Content-Type', 'text/html; charset=utf-8');
//   res.render('index');
// });



/* GET users listing. */
// ://products/students
router.get('/students', (req, res, next) => {
    connection.query('select `photos`.`photo_url`,`students`.`name`, `students`.`major`,`students`.`grade`, `students`.`profile_photo_url`, `products`.`id`, `products`.`genre`, `products`.`title` from `photos`, `products`, `students` where `products`.`id` BETWEEN 1 and 4 and `products`.`id` = `photos`.`product_id` and `students`.`id` = `products`.`representative_student_id`;',(err, row) => {
      console.log(`err: ${err}`);
      console.log(row);

      const  jsonListScreen =[];
      for(let i = 0; i < row.length; i++ ) {
        let objListScreen = {};
        objListScreen.type = row[i].major;      
        objListScreen.image_url = row[i].photo_url;
        objListScreen.owner = {
          name: row[i].name,
          subject: `${row[i].major} ${row[i].grade}`,
          image_url: row[i].profile_photo_url
        };
        jsonListScreen.push(objListScreen);
      };

      res.header("Content-Type", "application/json; charset=utf-8");
      console.log(jsonListScreen);
      res.json(jsonListScreen);
    });
});


// ://products/1
router.get('/:id',(req, res, next) => {
  let id = req.params.id;
  console.log(`id:${id}`);
  
  connection.query('SELECT `products`.`id`, `products`.`concept`, `photos`.`photo_url` FROM `products`, `photos` WHERE `products`.`id` = `photos`.`product_id` AND `products`.`id` = ?;',[id],(err, row) => {
    console.log(`err: ${err}`);
    console.log(row);
    
    const jsonDetailScreen = [];
    const image_url = [];
    let objDetailScreen = {};
    objDetailScreen.id = row[0].id;
    objDetailScreen.concept = row[0].concept;
    for (let y = 0; y < row.length; y++) {
      image_url.push(row[y].photo_url);
      
    }
//    console.log(row[0].photo_url);
    objDetailScreen.sub_image_urls = image_url;
    jsonDetailScreen.push(objDetailScreen);

    connection.query('SELECT `students`.`name`, `students`.`major`, `students`.`grade`, `students`.`profile_photo_url`,`students`.`message` FROM `students` WHERE `students`.`id` IN (SELECT `product_menbers`.`student_id` FROM `product_menbers` WHERE `product_menbers`.`product_id` = ?);',[id], (err,row) => {
      console.log(`err:${err}`);
      console.log(row);
      let owner = {};
      let member = {};
      const ary = [];
      owner.name = row[0].name;
      owner.subject = `${row[0].major} ${row[0].grade}`;
      owner.message = row[0].message;
      owner.image_url = row[0].profile_photo_url;
      console.log(row.length);
      
      objDetailScreen.owner = owner;
      for(let t = 1; t < row.length; t++) {
        member.name = row[t].name;
        member.subject = `${row[t].major} ${row[t].grade}`;
        member.message = row[t].message;
        member.image_url = row[t].profile_photo_url;
        ary.push(member);
        member = {};
      }
      objDetailScreen.member = ary;
      console.log(objDetailScreen);

      res.header("Content-Type", "application/json; charset=utf-8");
      console.log( jsonDetailScreen);
      res.json(jsonDetailScreen);
    });
  });
});
  
module.exports = router;
