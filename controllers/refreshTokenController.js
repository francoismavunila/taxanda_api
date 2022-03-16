const User = require('../models/user_model.js');
const jwt = require('jsonwebtoken');

const refreshToken = (req,res)=>{
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
    
 }

 module.exports = {refreshToken}