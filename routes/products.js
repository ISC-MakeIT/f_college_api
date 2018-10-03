let express = require('express');
let router = express.Router();
const mysql = require('mysql2');
const vote = require('./vote');

router.use('/:id/vote' , vote );

const connection = mysql.createConnection({
    host: process.env.NODE_DB_HOST,
    user: process.env.NODE_DB_USER,
    password: process.env.NODE_DB_PASSWORD,
    database: process.env.NODE_DB_DATABASE
});

router.get( '/' , ( req , res , next ) => {
    let select = '`photos`.`photo_url`,`students`.`name`, `students`.`major`,`students`.`grade`, `students`.`profile_photo_url`, `products`.`id`, `products`.`genre`, `products`.`title`';
    let from = '`photos`, `products`, `students`';
    let where = '`products`.`id` = `photos`.`product_id` and `students`.`id` = `products`.`representative_student_id`';
    connection.query( `select ${ select } from ${ from } where ${ where };` , ( err , row ) => {
        console.error( err );    
        const  jsonListScreen = [];
        for ( let obj of row ) {
            let objListScreen = {};
            objListScreen = {
                type : obj.major,
                image_url : obj.photo_url,
                owner : {
                    name : obj.name,
                    subject : `${ obj.major } ${ obj.grade }`,
                    image_url : obj.profile_photo_url
                }
            };
            jsonListScreen.push( objListScreen );
        }
        res.header( 'Content-Type', 'application/json; charset=utf-8' );
        res.json( jsonListScreen );
    });
});

router.get ( '/:id', ( req , res , next ) => {
    let id = req.params.id;
    let select = '`products`.`id`, `products`.`concept`, `photos`.`photo_url`';
    let from = '`products`, `photos`';
    let where = '`products`.`id` = `photos`.`product_id` AND `products`.`id` = ?';
    connection.query(`SELECT ${ select } FROM ${ from } WHERE ${ where };` , [id] , ( err , row ) => {
        console.error( err );
        const jsonDetailScreen = [];
        const image_url = [];
        let objDetailScreen = {};
        objDetailScreen = {
            id : row[0].id,
            concept : row[0].concept
        };
        for ( let obj of row ) {
            image_url.push( obj.photo_url );
        }
        objDetailScreen = {
            sub_image_urls : image_url
        };
        jsonDetailScreen.push( objDetailScreen );

        let selectSub  = '`students`.`name`, `students`.`major`, `students`.`grade`, `students`.`profile_photo_url`,`students`.`message`';
        let fromSub = '`students`';
        let whereSub = '`students`.`id` IN (SELECT `product_menbers`.`student_id` FROM `product_menbers` WHERE `product_menbers`.`product_id` = ?)';
        connection.query(`SELECT ${ selectSub } FROM ${ fromSub } WHERE ${ whereSub };` , [id] , ( err , row ) => {
            console.error( err );
            let owner = {};
            let member = {};
            const ary = [];
            owner = {
                name : row[0].name,
                subject : `${ row[0].major } ${ row[0].grade }`,
                message : row[0].message,
                image_url : row[0].profile_photo_url
            };
            objDetailScreen.owner = owner;
            for ( let obj of row ) {
                member = {
                    name :  obj.name,
                    subject : `${ obj.major } ${ obj.grade }`,
                    message : obj.message,
                    image_url : obj.profile_photo_url,
                };
                ary.push( member );
                member = {};
            }
            objDetailScreen.member = ary;
            res.header( 'Content-Type', 'application/json; charset=utf-8' );
            res.json( jsonDetailScreen );
        });
    });
});

module.exports = router;
