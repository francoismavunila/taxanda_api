const authRole = (...role)=>{
    return (req,res, next)=>{
        if(!req?.role){
            console.log('no request role')
            return res.sendStatus(401);
        } 
        console.log(role);
        const result = role.includes(req.role);
        console.log(result)
        if(result){
            next();
        }else{
            console.log('no request role not matching')
            return res.sendStatus(401);
        }

    }
}

module.exports = authRole;