let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index',{title:'Express'});
});

module.exports = router;
