const Mongoose = require('mongoose');
const Schema = Mongoose.Schema,
    ObjectId = Schema.ObjectId;
let AssignmentSchema = new Schema({
    orderId:{
        type:String,
        required:true,         
        unique:true            
    },
    topic:{
        type:String,
        default:''
    },
    deadLine:{
        type:String,
        default:'',        
    },
    documentType:{
        type:String,
        default:''
    },
    subject:{
        type:String,
        default:''
    },
    referenceStyle:{
        type:String,
        default:''
    },
    paperLength:{
        type:String,
        default:''
    },
    academicLevel:{
        type:String,
        default:''  
    },
    academicOption:{
        type:String,
        default:''
    },
    status:{
        type:String,
        default:'Unclaim'       
    },
    document_1:{
        type:ObjectId,
        ref:"uploads.files",
    },
    document_2:{
        type:String,
        default:'' 
    },
    document_3:{
        type:String,
        default:'' 
    },
    document_4:{
        type:String,
        default:'' 
    },
    message:{
        type:String,
        default:''
    },
	user:{
        type:ObjectId,
        ref:"users",
        required:"User is required"
    }
},{
    timestamps:true
});

let Assignments = Mongoose.model('Assignment', AssignmentSchema);
module.exports = Assignments;