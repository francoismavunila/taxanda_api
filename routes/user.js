const express = require('express');
const router = express.Router();
const user = require('../models/user_model');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

router.post('/login',(req,res)=>{
 user.findOne({Email:req.body.email})
 .exec()
 .then(_user=>{
     if(_user){
        res.status(200).json({
            data : _user
        })
     }else{
         console.log('invalid credentials')
        res.status(401).json({
            message :'invalid credentials'
        })
     }

 })
 .catch(err=>
    {
        res.status(500).json({
            message : 'server error'
        })
    })
})

router.post('/register',(req,res)=>{
  user.findOne({email:req.body.email})
  .exec()
  .then(_user=>{
    if(_user){
        res.status(400).json({
            message:'wrong email or password'
        })
    }else{
        bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
            const User = new user({
                Name : req.body.name,
                Email : req.body.email,
                Password : hash
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
})
module.exports = router;