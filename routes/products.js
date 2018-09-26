var express = require('express');
var router = express.Router();
const mysql = require('mysql');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sample'
});

/* GET users listing. */
router.get('/', (req, res, next) => {
    connection.query('select `photos`.`photo_url`,`students`.`name`, `students`.`major`,`students`.`grade`, `students`.`profile_photo_url`, `products`.`id`, `products`.`genre`, `products`.`title` from `photos`, `products`, `students` where `products`.`id` BETWEEN 1 and 4 and `products`.`id` = `photos`.`product_id` and `students`.`id` = `products`.`representative_student_id`;',(err, row) => {
      console.log(`err: ${err}`);
      console.log(row);

      let  JsonListScreen =[];
      for(let i = 0; i < 7; i++ ) {
        let ObjListScreen = {};
        ObjListScreen.type = row[i].major;      
        ObjListScreen.image_url = row[i].photo_url;
        ObjListScreen.owner = {
          name: row[i].name,
          subject: `${row[i].major} ${row[i].grade}`,
          image_url: row[i].profile_photo_url
        };
        JsonListScreen.push(ObjListScreen);
      };

      res.header("Content-Type", "application/json; charset=utf-8");
      console.log( JsonListScreen);
      res.json(JsonListScreen);
    });
});

router.get('/:id',(req, res, next) => {
  let id = req.params.id;
  console.log(`id:${id}`);
  
  connection.query('SELECT `products`.`id`, `products`.`concept`, `photos`.`photo_url` FROM `products`, `photos` WHERE `products`.`id` = `photos`.`product_id` AND `products`.`id` = ?;',[id],(err, row) => {
    console.log(`err: ${err}`);
//    console.log(row);
    
    let JsonDetailScreen = [];
    let image_url = [];
    let ObjDetailScreen = {};
    ObjDetailScreen.id = row[0].id;
    ObjDetailScreen.concept = row[0].concept;
    for (let y = 0; y < row.length; y++) {
      image_url.push(row[y].photo_url);
      
    }
//    console.log(row[0].photo_url);
    ObjDetailScreen.sub_image_urls = image_url;
    JsonDetailScreen.push(ObjDetailScreen);

    connection.query('SELECT `students`.`name`, `students`.`major`, `students`.`grade`, `students`.`profile_photo_url`,`students`.`message` FROM `students` WHERE `students`.`id` IN (SELECT `product_menbers`.`student_id` FROM `product_menbers` WHERE `product_menbers`.`product_id` = ?);',[id], (err,row) => {
      console.log(`err:${err}`);
      console.log(row);
      let owner = {};
      let member = {};
      let ary = [];
      owner.name = row[0].name;
      owner.subject = `${row[0].major} ${row[0].grade}`;
      owner.message = row[0].message;
      owner.image_url = row[0].profile_photo_url;
      console.log(row.length);
      
      ObjDetailScreen.owner = owner;
      for(let t = 1; t < row.length; t++) {
        member.name = row[t].name;
        member.subject = `${row[t].major} ${row[t].grade}`;
        member.message = row[t].message;
        member.image_url = row[t].profile_photo_url;
        ary.push(member);
        member = {};
      }
      ObjDetailScreen.member = ary;
      console.log(ObjDetailScreen);

      res.header("Content-Type", "application/json; charset=utf-8");
      console.log( JsonDetailScreen);
      res.json(JsonDetailScreen);
    });
  });
});
  
module.exports = router;
