var mqtt = require('mqtt')

var options = {
    host: 'b602c88e789043e8afecd76fb4efe9f6.s1.eu.hivemq.cloud',
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
    console.log('Received message:', topic, message.toString());
});

// subscribe to topic 'my/test/topic'
client.subscribe('sensor1');

// publish message 'Hello' to topic 'my/test/topic'
client.publish('command1', 'Hello from Node');