const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/singup', (req, res, next) => {
    User.find({email: req.body.email})
      .exec()
      .then(user =>{
        if (user.length >= 1 ){
            return res.status(409).json({
              message: 'This email already exists'
            });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) =>{
              if(err) {
                return res.status(500).json({
                  error: err
                });
              } else{
                const user = new User({
                  _id: new mongoose.Types.ObjectId(),
                  email: req.body.email,
                  password: hash
                });
                user
                .save()
                .then(result =>{
                  console.log(result);
                  res.status(201).json({
                    message: 'user created =) '
                  });
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json({
                    error: err
                  });
                });
              }
          });
        }
      })
    });

router.post('/login', (req, res, next) =>{
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          //incorrect email
          message: 'Auth failed =('
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            //Error in unhashing password
            message: 'Auth failed =('
          });
        }
        if (result) {
            const token = jwt.sign({
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
          {
            expiresIn: "1h"
          }
          );
            return res.status(200).json({
              message: 'Auth successful =)',
              token: token
            });
        }
         res.status(409).json({
          //incorrect password
          message: 'Auth failed =('
        });
      });
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:userId', (req, res, next) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'user deleted =('
      });
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  });





module.exports = router;
