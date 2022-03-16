const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    Name :{type: String, required: true},
    Email:{type: String,required: true, unique:true},
    Password: {type:String, required: true} ,
    refreshToken : {type:String},
    Role : {type:Number,required:true}
});

module.exports = mongoose.model('Users',UserSchema);