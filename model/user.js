const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
let UserSchema = new Schema({
    name:{
        type:String,
        required:true       
    },
    email:{
        type:String,
        required:true,
        unique:true        
    },
    password:{
        type:String,
        required:false,
        min:3        
    },
    phone:{
        type:String,
        default:''     
    },
    userType:{
        type:String,
        default:'student'
    },
    country:{
        type:String,
        default:""
    },
    state:{
        type:String,
        default:""
    },
    city:{
        type:String,
        default:""
    },
    zip:{
        type:String,
        default:""
    },
    address:{
        type:String,
        default:''        
    },
    profile:{
        type: String,
        default: ''
    }
},{
    timestamps:true
});

let Users = Mongoose.model('User',UserSchema);
module.exports = Users;