let express = require('express');
let router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
    console.log(req.params);
    res.send(req.params);
});

module.exports = router;
