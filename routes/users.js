const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../model/user'); 
const fs = require('fs');
const path = require('path'),
imageDir = '/uploads/';
/* GET users listing. */
router.get('/', function(req, res, next) {
  Users.find({})
    .then((user) =>{
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json');
      res.json(user);
    },(err) => next(err))
    .catch((err) => next(err));  
})
.post('/signup', (req, res, next) =>{
  // console.log(req.body);
  Users.findOne({ email: req.body.email },  (err, oldUser) =>{
       // Make sure user doesn't already exist
    if (oldUser){
        // console.log('test', oldUser);
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(oldUser);         
    }else{
      bcrypt.hash(req.body.password, 10, function(err, hash){
        if(err) {
          return res.status(500).json({
             error: err
          });
       } else {
         req.body.password = hash,
         Users.create(req.body)
           .then((user) =>{
             res.statusCode = 200;
             res.setHeader('Content-type', 'application/json');
             res.json(user);         
           },(err) => next(err))
           .catch((err) => next(err));
         }
      }) 
    }    
})
})
.post('/login', function(req, res){
  Users.findOne({email: req.body.email})
  .exec()
  .then(function(user) {
     bcrypt.compare(req.body.password, user.password, function(err, result){
        if(err) {
           return res.status(401).json({
              failed: 'Unauthorized Access'
           });
        }
        if(result) {
           const JWTToken = jwt.sign({
              email: user.email,
              _id: user._id
           },
           'secret',
              {
                 expiresIn: '2h'
              });
           return res.status(200).json({
              success: 'Welcome to the JWT Auth',
              token: JWTToken
           });
        }
        return res.status(401).json({
           failed: 'Unauthorized Access'
        });
     });
  })
  .catch(error => {
     res.status(500).json({
        error: error
     });
  });;
});;

router.get('/user/:userId', (req, res, next) => {
  Users.findById(req.params.userId)
    .then((user) =>{
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json');
      res.json(user);
    },(err) => next(err))
    .catch((err) => next(err));  
})
.put('/user/:userId', (req, res, next) => {
  Users.findByIdAndUpdate(req.params.userId, {
      $set: req.body
  }, { new: true })
  .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete('/user/:userId',(req, res, next) => {
  Users.findByIdAndRemove(req.params.userId)
    .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.get('/profileImage', (req, res) => {
  // console.log(path.join(__dirname, 'uploads/'), 'HELLOE');
  fs.readFile(imageDir, function (err, content) {
      // console.log('_1');
      if (err) {
          res.writeHead(400, {'Content-type':'text/html'})
          // console.log(err);
          res.end("No such image");    
      } else {
          //specify the content type in the response will be an image
          res.writeHead(200,{'Content-type':'image/jpg'});
          // console.log('hello');
          res.end(content);
      }
  });
});

module.exports = router;
