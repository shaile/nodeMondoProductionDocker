const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
let FileSchema = new Schema({});

let Files = Mongoose.model('Uploads.file',FileSchema);
module.exports = Files;

