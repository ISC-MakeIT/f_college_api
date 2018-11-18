const express = require('express');
const router = express.Router();
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, './public')));


const path = require("path");

/* GET home page. */
router.get('*', function(req, res) {
    res.sendFile(path.join(__dirname,"../", "public", "index.html"));
});

module.exports = router;
