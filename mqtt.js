var mqtt = require('mqtt');
const driver = require('./models/driver_model.js');
const mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/Taxanda_database')
.then(() => console.log("Database connected on child process!"))
.catch(err => console.log(err));;

var options = {
    host: '9c641868feef4f288cb222c3d38b905e.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'Francois',
    password: '12345Fra'
}

//initialize the MQTT client
var client = mqtt.connect(options);

//setup the callbacks
client.on('connect', function () {
    console.log('Connected');
});

client.on('error', function (error) {
    console.log(error);
});

client.on('message', function (topic, message) {
    //Called each time a message is received
    if(topic=='driv/register/sendFP'){
        console.log( message.toString());
        var messageObj = JSON.parse(message);
        console.log("device id"+messageObj.device_id)
        console.log("driver id"+messageObj.driver_id)
        console.log("data"+messageObj.data)
        driver.findOne({National_id:messageObj.driver_id})
        .exec()
        .then((_driver)=>{
            if(_driver){
               console.log("driver is"+_driver);
               _driver.FingerPrint =messageObj.data;
               _driver.save()
               .then(result=>{
                   console.log("done, send flag to app now");
                   client.publish('registration', 'done');
               })
            }else{
                console.log("couldn't get particular driver");
                client.publish('registration', 'Wrong Driver Id');
            }

        })
        .catch(err=>{
            console.log("error is"+err);
            client.publish('registration', 'server error');
        })
    }else{
        console.log(message)
        console.log('Received message:', topic, message.toString());
    }
});

// subscribe to topic 
client.subscribe('driv/register/sendFP');

// publish message 'Hello' to topic 
//client.publish('driver/register/getFP', 'getfingerprint');

