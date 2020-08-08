const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const JWT = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email field is required" })
    } else if (!name) {
        return res.status(400).json({ error: "Name field is required" })
    } else if (!password) {
        return res.status(400).json({ error: "Password field is required" })
    } else if (!email || !name || !password) {
        return res.status(400).json({ error: "All fields are required" })
    }
    User.findOne({ email: email }).then((isExist) => {
        if (isExist) {
            return res.status(400).json({ error: "Email is already exist" })
        }
        bcrypt.hash(password, 12).then((hashedPassword) => {
            const user = new User({
                name,
                email,
                password: hashedPassword
            })
            user.save().then(userSaved => {
                res.status(200).json({ message: "Account created" })
            }).catch(error => {
                console.log(error);
            })
        }).catch(error => {
            console.log(error);
        })
    }).catch(error => {
        console.log(error);
    })
});

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({error: "Email and Password fields are required"})
    }
    User.findOne({email: email}).then(userData => {
        if(!userData) {
            return res.status(400).json({error: "Invalid Email or Password"})
        }
        bcrypt.compare(password, userData.password).then(isMatched => {
            if(isMatched) {
                const token = JWT.sign({_id: userData.id}, JWT_SECRET);
                return res.status(200).json({access_token: token});
                // return res.status(200).json({message: "Signin successfully"});
            } else {
                return res.status(400).json({error: "Invalid Email or Password"})
            }
        }).catch(error => {
            console.log(error);
        })
    }).catch(error => {
        console.log(error);
    })
})

module.exports = router;
