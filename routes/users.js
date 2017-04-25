/**
 * Created by centmaster on 2017/4/25.
 */

var express = require('express');
var router = express.Router();
var app = express();


router.get('/', function(req, res) {
    res.render('users', {
        supplies: app.get('props')
    });
});

module.exports = router;