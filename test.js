var superagent = require('superagent');
var cheerio = require('cheerio');
var path = require('path')
var url = require('url');
var async = require('async');
var events = require("events");
var emitter = new events.EventEmitter();
var express = require('express');
var app = express();

var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');



var topicUrls = [];
var i=1;

    app.get('/', function (req, res, next) {
        while (i < 20) {
            var cnodeUrl = (i == 1 ? 'http://m.byr.cn/board/ParttimeJob' : 'http://m.byr.cn/board/ParttimeJob?p=' + i);
            superagent.get(cnodeUrl)
                .set("Cookie", 'nforum[UTMPUSERID]=centmaster; nforum[PASSWORD]=3BiOD9Oa3bii6juOdrIr4A%3D%3D; nforum[UTMPKEY]=31287208; nforum[UTMPNUM]=915; Hm_lvt_a2cb7064fdf52fd51306dd6ef855264a=1492694821; Hm_lpvt_a2cb7064fdf52fd51306dd6ef855264a=1492912244')
                .end(function (err, res) {
                    if (err) {
                        console.log('err!try again');
                    }

                    var $ = cheerio.load(res.text);
                    //console.log(cheerio.load(res.text));
                    $('.list>li div:first-child a').each(function (index, element) {
                        var $element = $(element);
                        var href = url.resolve(cnodeUrl, $element.attr('href'));
                        var title = $element.text();
                        topicUrls.push({
                            title: title,
                            href: href

                        });
                    });
                    console.log(topicUrls);

                })
            i++;
        }
        res.send(topicUrls);
    })
    app.set('views', path.join(__dirname, 'views'));// 设置存放模板文件的目录
    app.set('view engine', 'ejs');// 设置模板引擎为 ejs

    app.set('props',topicUrls);

    //app.use('/', indexRouter);
    app.use('/users', userRouter)


app.listen(3000, function () {
    console.log('app is listening at port 3000');
});

