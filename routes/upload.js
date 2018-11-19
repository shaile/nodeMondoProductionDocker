var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    // //   cb(null, `${__dirname}/public/uploads/profile`)
    // console.log(`${__dirname}/public/uploads/profile`);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
  })
  
var upload = multer({ storage: storage }).single('file');

router.post('/', (req, res) => { 
    // console.log(req.file); 
 
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
    } else if (err) {
      console.log(err);
    }  
    // console.log(req.file.path); 
    // console.log(req.file.mimetype); 
    //  console.log(req.file.mimetype);  // form fields
    // console.log(req.file.filename); // form files
    res.json({
        success:true,
        filename:req.file.filename,
        message:'image uploaded!'
    });
    
    // Everything went fine.
  })
});

module.exports = router;
