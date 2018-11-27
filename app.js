const express = require('express');
const app = express();
// login staff
const  morgan = require('morgan');
// package to parse the body of the request
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
// const bcryptjs = require ('bcryptjs');



// routes reacher
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
mongoose.connect('mongodb://giuseppe_augello:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop-shard-00-00-hrwbz.mongodb.net:27017,node-rest-shop-shard-00-01-hrwbz.mongodb.net:27017,node-rest-shop-shard-00-02-hrwbz.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin&retryWrites=true',
{useNewUrlParser: true,
//useMongoClient: true
});
mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS errors handler middleware giving access to every webpage *  and providing some headers back
app.use((req, res, next) =>{
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
// calling next we ensure that the the API continues to work
  next();
});

// middlewares to handle requests that reach my routs
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
//middleware to handle requests comingn on not fidden routes  ergo 404 error
app.use((req, res, next) =>{
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
      error:{
        message: error.message
      }
    });
  });

module.exports = app;
