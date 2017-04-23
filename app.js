
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var async = require('async');
var events = require("events");
var emitter = new events.EventEmitter()
setCookeie ();
emitter.on("setCookeie", getTitles)


var cnodeUrl = 'http://m.byr.cn/board/ParttimeJob'


function setCookeie () {
    superagent.post('http://m.byr.cn/')  //学校里的一个论坛，这是登录提交地址
        .type("form")
        .send({id:"centmaster"})
        .send({passwd:"fantasticcap8"})
        .end(function(err, res){
            if (err) throw err;
            var cookie = res.header['set-cookie']             //从response中得到cookie
            emitter.emit("setCookeie", cookie)
        })

}



function getTitles (cookie) {

    superagent.get(cnodeUrl)
        .set("Cookie",'nforum[UTMPUSERID]=centmaster; nforum[PASSWORD]=3BiOD9Oa3bii6juOdrIr4A%3D%3D; nforum[UTMPKEY]=31287208; nforum[UTMPNUM]=915; Hm_lvt_a2cb7064fdf52fd51306dd6ef855264a=1492694821; Hm_lpvt_a2cb7064fdf52fd51306dd6ef855264a=1492912244')
        .set("Accept",'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
        .set('Content-Type','application/x-www-form-urlencoded')
        .set('Referer','http://m.byr.cn/')
        .set('User-Agent','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36')
        .set('Upgrade-Insecure-Requests','1')
        .end(function(err, res) {
            console.log(res);
            if (err){
                console.log('err!try again');
            }
            var topicUrls = [];
            var $ = cheerio.load(res.text);
            $('.list>li a').each(function(index, element) {
                var $element = $(element);
                //console.log($element);
                var href = url.resolve(cnodeUrl, $element.attr('href'));
                topicUrls.push(href);
            });
            //console.log(topicUrls);
            var data = [];
            /**
             * queue(worker, concurrency)
             * queue 是一个串行的消息队列，通过限制了 worker 数量，不再一次性全部执行。
             * 当 worker 数量不够用时，新加入的任务将会排队等候，直到有新的 worker 可用。
             *
             */
                // 定义一个 queue，设 worker 数量为 5
            var q = async.queue(function(task, callback) {
                    var topicUrl = task.topicUrl;
                    superagent.get(topicUrl)
                        .set("Cookie",'nforum[UTMPUSERID]=centmaster; nforum[PASSWORD]=3BiOD9Oa3bii6juOdrIr4A%3D%3D; nforum[UTMPKEY]=31287208; nforum[UTMPNUM]=915; Hm_lvt_a2cb7064fdf52fd51306dd6ef855264a=1492694821; Hm_lpvt_a2cb7064fdf52fd51306dd6ef855264a=1492912244')
                        .set("Accept",'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
                        .set('Content-Type','application/x-www-form-urlencoded')
                        .set('Referer','http://m.byr.cn/')
                        .set('User-Agent','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36')
                        .set('Upgrade-Insecure-Requests','1')
                        .end(function(err, res) {
                            var $ = cheerio.load(res.text);
                            var result = {
                                title: $('.f').text().trim(),
                                href: topicUrl,
                                //content: $('.reply_content').eq(0).text().trim()
                            };
                                callback(data.push(result));
                        });
                }, 5);

            /**
             * 监听：当所有任务都执行完以后，将调用该函数
             */
            q.drain = function() {
                console.log('all tasks have been processed');
                console.log(data);
            };

            /**
             * 添加任务
             */
            topicUrls.forEach(function(topicUrl) {
                q.push({ topicUrl: topicUrl }, function(err) {
                    console.log('push finished ' + topicUrl);
                });
            });
        });

};





// $('.topic_full_title').text().trim()










