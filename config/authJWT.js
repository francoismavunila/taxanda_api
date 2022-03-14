const jwt = require('jsonwebtoken');
require('dotenv').config();

const authJWT = (req, res, next)=>{
    const authHeader = req.Headers['authorization'];
    if(!authHeader) return res.sendStatus(401);
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded)=>{
            if(err) return res.sendStatus(403);  
            req.user = decoded.Email;
            next(); 
        }
    )
}

module.exports = authJWT; 