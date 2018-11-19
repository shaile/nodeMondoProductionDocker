const express = require("express");
const crypto = require('crypto');
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose'); 
const multer = require("multer"); 
const GridFsStorage = require("multer-gridfs-storage");
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
const mongoUri = require('../mongoUri'); 
const conn = mongoose.createConnection(mongoUri);
let gfs;
var CHUNKS_COLL = 'uploads.chunks';
var FILES_COLL = 'uploads.files';
conn.once('open', ()=>{
    gfs = Grid(conn.db,mongoose.mongo);
    gfs.collection('uploads');    
});
/** Setting up storage using multer-gridfs-storage */
const storage = new GridFsStorage({
  url:mongoUri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

var upload = multer({ storage});

/** API path that will upload the files */
router.post("/", upload.single('file'),  (req, res) => {
   res.json({file: req.file});
});


router.post("/muliupload", upload.array("uploads", 12),  (req, res) => {
    console.log('hello',req);
    res.json({files: req.files});
 });

router.get("/files", (req, res) => {
    gfs.files
    .find()
    .toArray(function(err, files) { 
      if (!files || files.length === 0) {
        return res.status(404).json({
          responseCode: 1,
          responseMessage: "error"
        });
      }
      return res.json(files);
    });
});
/**
 * 
 */
router.get("/file/:filename", (req, res) => {
    gfs.files
    .findOne({filename: req.params.filename}, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
              responseCode: 1,
              responseMessage: "error"
            });
        }
        return res.json(file); 
    });
});

/**
 * 
 */

router.get("/image/:filename", (req, res) => {
    gfs.files
    .findOne({filename: req.params.filename}, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
              responseCode: 1,
              responseMessage: "error"
            });
        }
       if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
       } else {
        res.status(404).json({
            responseCode: 1,
            responseMessage: "Not an image!"
          });
       }
    });
});


router.get('/fileById/:id',function(req,res){
    console.log(req.params.id);
    var file_id = req.params.id;

  gfs.files.find({_id: file_id}, (err, file) => {
    console.log(file);
    if(err) {
        res.status(404).end();
    } else if(!file){
        res.status(404).end();
    } else {
        var readstream = gfs.createReadStream({
          _id: file._id
        });
       
        res.set('Content-Type', file.contentType);

        readstream.on('error', function (err) {
            res.send(500, err);
        });
        readstream.on('open', function () {
            readstream.pipe(res);
        });
    }
});
      
    //   if (file.length > 0) {
    //       var mime = 'image/jpeg';
    //       res.set('Content-Type', mime);
    //       var read_stream = gfs.createReadStream({filename: req.params.id});
    //       read_stream.pipe(res);
    //   } else {
    //       res.json('File Not Found');
    //   }
  }); 

router.delete("/file/:filename", (req, res)=>{
    gfs.remove({filename: req.params.filename, root:'uploads'}, (err, gridStore) =>{
        if(err){
            return res.status(404).json({err:err});
        }
        return res.json(gridStore); 
    });
});
module.exports = router;
