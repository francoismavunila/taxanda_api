const mongoose = require('mongoose');

const DriverSchema = mongoose.Schema({
    Name :{type: String, required: true},
    Surname: {type:String, required: true} ,
    Email:{type: String,required: true, unique:true},
    National_id: {type:String, required: true} ,
    FingerPrint : {type:String},
    Phone : {type:Number,required:true},
    Responder: {type:String, required: true} 
});

module.exports = mongoose.model('Drivers',DriverSchema);