const Mongoose = require('mongoose');
const connUrl = require('./mongoUri');
const connect = Mongoose.connect(connUrl,{ 
    useNewUrlParser:true,
    dbName:'usermanagement'
}); 

connect.then(() => {
  console.log('Connected correctly to server');
}, (err) => { console.log(err); });
 
 
 module.exports = connect;