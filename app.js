const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/Taxanda_database')
.then(() => console.log("Database connected!"))
.catch(err => console.log(err));;


// mongoose 
//  .connect('mongodb://localhost/Taxanda_database', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true,   })   
//  .then(() => console.log("Database connected!"))
//  .catch(err => console.log(err));


const userRoutes = require('./routes/user')

const driverRoutes = require('./routes/driver')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


console.log('cookie parser')
app.use(cookieParser());

app.use(morgan('dev')); 
app.use(cors({credentials: true,origin: "http://localhost:3000"}));

console.log('routing to user');
app.use('/user',userRoutes);
app.use('/driver',driverRoutes);

app.use((req,res,next)=>{
    console.log('here')
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res,next)=>{
    res.status(error.status || 500);
    res.json({
        errror:{
            message :error.message
        }
    })
})

module.exports = app;