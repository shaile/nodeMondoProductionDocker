var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Assignments = require('../model/assignment');
//const userId = '5bba293b40000f56cc629f08';
/* GET assignment listing. */
router.get('/:sortBy/:orderBy/:skip/:limit', function(req, res, next) {
	// console.log(req.query.type);
	const searchObj = {};
	const searchQuery = (req.query.type && req.query.type === 'new')? searchObj['status'] = 'Unclaim' : searchObj;
    const sortObject = {};
    const sortBy = (req.params.sortBy)?req.params.sortBy:'deadLine';
    const orderBy = (req.params.orderBy)?req.params.orderBy:1;
	const skip = (req.params.skip)?req.params.skip:0;
	const limit = (req.params.limit > 0)?req.params.limit:10;
    sortObject[sortBy] = orderBy;
    Assignments.find(searchObj)
      
      .populate({
        path: 'uploads.files' 
      })
     
      .sort(sortObject) 
	  .skip(Number(skip))
	  .limit(Number(limit))
      .then((assignment) =>{
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(assignment);
      },(err) => next(err))
      .catch((err) => next(err));  
  })
  .get('/all', function(req, res, next) {
	// console.log(req.query.type);
	const searchObj = {};
	const searchQuery = (req.query.type && req.query.type === 'new')? searchObj['status'] = 'Unclaim' : searchObj;
    Assignments.find(searchObj)
      .countDocuments()
      .then((assignment) =>{
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(assignment);
      },(err) => next(err))
      .catch((err) => next(err));  
  })
  .post('/add', (req, res, next) =>{    
    //req.body.user = userId; 
    // console.log(req.body);
    req.body.orderId = 'BWE-'+ Math.floor(Math.random() * 9999); 
    Assignments.create(req.body)
    .then((assignment) =>{
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json');
      res.json(assignment);         
    },(err) => next(err))
    .catch((err) => next(err));
  })
  .get('/:assmntId', (req, res, next)=> {
    Assignments.findOne({_id:req.params.assmntId})
      .populate('user') 
      .then((assignment) =>{
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(assignment);
      },(err) => next(err))
      .catch((err) => next(err));  
  })
  .delete('/:assmntId', (req, res, next) => {
    Assignments.findOneAndDelete({_id:req.params.assmntId})
        .then((response) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json({
                'message':'Assignment successfully deleted',
                'id':response._id
            });
        },(err) => next(err))
        .catch((err) => next(err));  
  });

  module.exports = router;