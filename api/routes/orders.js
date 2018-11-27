const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');
const Order = require("../models/order");
const Product = require("../models/product")

router.get('/', (req, res, next) =>{
  Order.find()
  .select( 'product quantity _id')
  .populate('product', 'name')
  .exec()
  .then(docs =>{
    res.status(200).json({
      count: docs.length,
      orders: docs.map(doc => {
        return {
          _id: doc._id,
          products: doc.product,
          quantity: doc.quantity,
          request: {
              type: 'GET',
              url: 'http://localhost:300/orders/' + doc._id
          }
        }
      })

    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  })
});
// 201 status is the appropriate one to say OKAY
router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Product not found",
        error:err
      });
    });
});





// dynamic path parameter with :
router.get('/:orderId', (req, res, next) =>{
  Order.findById(req.params.orderId)
  .populate('product')
  .exec()
  .then(order => {
    if (!order) {
      return res.status(404).json({
        message:"Order not found"
      });
    }
    res.status(200).json({
      order: order,
      request: {
        type: "GET",
        url: "http://çocalhost:3000/orders"
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
});

router.delete('/:orderId', (req, res, next) =>{
  res.status(201).json({
    message: 'Order deleted',
    orderId: req.params.orderId
  });
});
module.exports = router;
