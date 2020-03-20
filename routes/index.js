var express = require('express');
var router = express.Router();
var scrape = require('../controllers/scrapeController.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/scrape', scrape.scrape)


module.exports = router;
