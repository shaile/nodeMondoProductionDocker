var express = require('express');
var router = express.Router();
const Countries = require('../model/country');

/* GET users listing. */
router.get('/', function(req, res, next) {
  Countries.find({})
    .then((country) =>{
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json');
      res.json(country);
    },(err) => next(err))
    .catch((err) => next(err));  
})
module.exports = router;
