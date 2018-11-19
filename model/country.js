const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
let CountrySchema = new Schema({
    CountryName:{
        type:String,
        required:true,        
    },
    States:[{
		StateName:{
			type:String,
			required:true	
		},
		Cities:[{
			type:String,
			required:true
		}]
	}]
},{
    timestamps:true
});
let Countries = Mongoose.model('Country',CountrySchema);
module.exports = Countries;