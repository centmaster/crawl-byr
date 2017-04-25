/**
 * Created by centmaster on 2017/4/25.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('请打开链接localhost:3000/user');
});

module.exports = router;