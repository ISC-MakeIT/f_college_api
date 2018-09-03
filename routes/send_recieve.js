var express = require('express');
var router = express.Router();
const app=express();
const bodyParser=require('bodo-parser');


router.get('/', function(req, res, next) {
    console.log(req.body);
    res.send(req.body);
});

module.exports = router;
