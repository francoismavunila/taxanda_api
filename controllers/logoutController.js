const user = require('../models/user_model.js');

const logout = (req,res)=>{
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
                    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None',secure:true });//add secure: true in prod when using https
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

}

module.exports = {logout}