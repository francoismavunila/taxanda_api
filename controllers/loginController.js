const user = require('../models/user_model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const login = (req,res)=>{
    console.log('insider login controller');
    const { email, password } = req.body;
    console.log('email is :'+ email)
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
                   const role = _user.Role;
                   const accessToken = jwt.sign({
                       userInfo:{
                        "userEmail" : _user.Email,
                        "role":role  
                       }
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
                        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None',secure:true ,  maxAge: 24 * 60 * 60 * 1000 }); //secure: true, 
                        res.json({role, accessToken });
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
}


module.exports = {login};