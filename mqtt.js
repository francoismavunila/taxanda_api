var mqtt = require('mqtt')

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
    console.log(message)
    console.log('Received message:', topic, message.toString());
});

// subscribe to topic 
client.subscribe('drive/register/sendFP');

// publish message 'Hello' to topic 
client.publish('driver/register/getFP', 'getfingerprint');