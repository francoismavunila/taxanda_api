require('child_process').fork('mqtt.js');

const http = require('http');//require the http library

const app = require('./app');

const port = process.env.PORT || 5003;// assign port 

const server = http.createServer(app);// create a server and pass a function that runs when there is a request

server.listen(port);//listen to the port and then run the function passed to createServer()