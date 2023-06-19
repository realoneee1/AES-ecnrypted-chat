// Importing User model
const Users = require('../models/users_model');

// Importing Express Modules
const express = require('express');
const router = express.Router();

// Importing Encryption Modules
const bcrypt = require('bcryptjs');

// Importing Verifation & Validation Models
const registerValidation = require('../models/register_validation_model');
const loginValidation = require('../models/login_validation_model');

// Returns all Users
router.get('/', (req,res) => {
    Users.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(400).json("Error: "+err));
})

// New User Registration
router.post('/register', (req,res) => {
    const {error} = registerValidation.validate(req.body);
    if(error) return res.status(400).json(error.details[0].message);

    Users.findOne({email:req.body.email}, (err, user) => {
        if(user) return res.status(400).json("Email Exists");

        const salt = 10;
        bcrypt.hash(req.body.password, salt, (err,hash) => {  
        Users.updateOne(
            { email: req.body.email },
            {
                fname: req.body.fname,
                email: req.body.email,
                password: hash,
                id: req.body.id
            },
            { upsert: true }
        )
            .then(() => res.json("User Added"))
            .catch((err) => res.status(400).json("Error: "+err));
        })
    });
})



// Check Login of a User
router.post('/login', (req,res) => {
    const {error} = loginValidation.validate(req.body);
    if(error) return res.status(400).json(error.details[0].message);

    Users.findOne({ email: req.body.email })
        .then((user) => {
            bcrypt.compare(req.body.password, user.password, (err,auth) => {
                if(!auth){
                  res.status(400).json("Passwords do not match");  
                }
                else{
                    const payload = {
                        id: user.id,
                        fname: user.fname
                    };
                    res.json(payload)
                }    
        }) 
    })
    .catch((err) => res.status(400).json("Email Doesn't Exists "+err))
})

// logout
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})

// Delete a perticular User
router.delete('/:id', (req,res) => {
    Users.findByIdAndDelete(req.params.id)
        .then(() => res.json("User Account Deleted"))
        .catch((err) => res.status(400).json("Error: "+err));
})

module.exports = router;