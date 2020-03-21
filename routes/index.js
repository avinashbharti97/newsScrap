var express = require('express');
var router = express.Router();
var scrape = require('../controllers/scrapeController.js')
const newsPath = './news.json';
const fs = require('fs')
const cron = require('node-cron');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//router.get('/scrape', scrape.scrape)
cron.schedule("* * * * *", scrape.scrape);

router.get('/news', (req, res)=>{
  fs.readFile(newsPath, 'utf8', (err, data)=>{
    if(err){
      throw err;
    }

    res.send(JSON.parse(data));
  })
})


module.exports = router;
