const driver = require('../models/driver_model.js');



const registration = (req,res)=>{
    console.log('insider driver register controller');
    const { email,name,surname,phone,responder,national } = req.body;
    console.log('email is :'+ email)
    if (!email || !surname ||!national || !name || !responder|| !phone) return res.status(400).json({ 'message': 'makesure all fields are filled' });
    driver.findOne({Email:req.body.email})
    .exec()
    .then(_driver=>{
      if(_driver){
          console.log('found user'+_driver)
          res.status(400).json({
              message:'user already registered'
          })
      }else{
        const Driver = new driver({
            Name : name,
            Email : email,
            Phone : phone,
            Responder : responder,
            National_id : national,
            FingerPrint :"",
            Surname : surname
        });
        Driver.save()
        .then(result=>{
            console.log(result);
            
            res.status(200).json({
                message:'registered successfully',
                driver_id:national
            })
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({
                message:'server error'
            })
        })
      }
    })
    .catch(error=>{
        console.log(error);
        res.status(500).json({
          message:'server error'
      })
    })
  }

  module.exports = {registration}