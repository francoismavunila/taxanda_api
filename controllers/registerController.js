const user = require('../models/user_model.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const register = (req,res)=>{
    console.log('insider register controller');
    const { email, password,role,name } = req.body;
    console.log('email is :'+ email+role+name)
    if (!email || !password ||!role || !name) return res.status(400).json({ 'message': 'makesure all fields are filled' });
    user.findOne({Email:req.body.email})
    .exec()
    .then(_user=>{
      if(_user){
          console.log('found user'+_user)
          res.status(400).json({
              message:'wrong email or password'
          })
      }else{
          bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
              const User = new user({
                  Name : req.body.name,
                  Email : req.body.email,
                  Password : hash,
                  refreshToken :"",
                  Role : req.body.role
              });
              User.save()
              .then(result=>{
                  console.log(result);
                  res.status(200).json({
                      message:'registered successfully'
                  })
              })
              .catch(err=>{
                  console.log(err)
                  res.status(500).json({
                      message:'server error'
                  })
              })
          });
      }
    })
    .catch(error=>{
        console.log(error);
        res.status(500).json({
          message:'server error'
      })
    })
  }

  module.exports = {register}