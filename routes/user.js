const express = require('express');
const router = express.Router();
const user = require('../models/user_model');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { response } = require('../app');
require('dotenv').config(); 


router.post('/login',(req,res)=>{
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'Username and password are required.' });
    console.log(email+ password)
    user.findOne({Email:email})
    .exec()
    .then(_user=>{
        if(_user){
            //check password
            bcrypt.compare(password, _user.Password).then(function(result) {
                if(result){
                    console.log(result)
                   //using jwt to authontenticate
                   const accessToken = jwt.sign({
                     "userEmail" : _user.Email  
                   },
                   process.env.ACCESS_TOKEN_SECRET,
                   {expiresIn:'30s'} 
                   )
                   const refreshToken = jwt.sign({
                     "userEmail" : _user.Email  
                   },
                   process.env.REFRESH_TOKEN_SECRET,
                   {expiresIn:'1d'} 
                   )
                   console.log(accessToken)
                   _user.refreshToken=refreshToken;
                   _user.save()
                   .then(response=>{
                        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); //secure: true, 
                        res.json({ accessToken });
                   })
                   .catch(error=>{
                       console.log(error);
                        res.status(401).json({
                        message :'Cannot authenticate'
                    })     
                   })
                }else{
                    res.status(401).json({
                        message :'invalid credentials'
                    })                   
                }
            });
            
        }else{
            console.log('invalid credentials')
            res.status(401).json({
                message :'invalid credentials'
            })
        }

    })
    .catch(err=>{
        console.log(err)
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
                Password : hash,
                refreshToken :""
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

router.get('/refreshtoken',(req,res)=>{
   const cookies = req.cookies 
   if(cookies?.jwt) res.status(401);
   console.log(cookies);
   const refreshToken = cookies.jwt;

   user.findOne({refreshToken:refreshToken})
   .exec()
   .then(_user=>{
        if(_user){
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, decoded)=>{
                    if(err || user.Email !== decoded.userEmail) return res.sendStatus(403);

                    const accessToken = jwt.sign({
                        "userEmail" : decoded.userEmail  
                      },
                      process.env.ACCESS_TOKEN_SECRET,
                      {expiresIn:'30s'} 
                      )
                      res.json({accessToken})
                }
            )
        }else{
            res.status(403);
        }
   })
   .catch(err=>{
       res.status(500).json({
           "message":"server error"
       })
   })
   
})

router.get('/logout',(req,res)=>{
    const cookies = req.cookies 
    if(cookies?.jwt) res.status(204);//not content to send

    const refreshToken = cookies.jwt;

    user.findOne({refreshToken:refreshToken})
    .exec()
    .then(_user=>{
         if(_user){
            _user.refreshToken='';
            _user.save()
            .exec()
            .then(response=>{
                if(response){
                    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });//add secure: true in prod when using https
                    res.status(204);
                }else{
                    console.log(response)
                    res.status(500).json({message:'server error'})
                }
            })
            .catch(err=>{
                console.log(err)
                res.status(500).json({message:'server error'})
            })
         }else{
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
             res.status(204);
         }
    })
    .catch(err=>{
        res.status(500).json({
            "message":"server error"
        })
    })

})
module.exports = router;