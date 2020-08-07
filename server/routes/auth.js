const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");

router.get('/', (req, res) => {
    res.send('Hello');
});

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    if(!email) {
        return res.status(400).json({error: "Email field is required"})
    } else if(!name) {
        return res.status(400).json({error: "Name field is required"})
    } else if(!password) {
        return res.status(400).json({error: "Password field is required"})
    } else if(!email || !name || !password) {
        return res.status(400).json({error: "All fields are required"})
    }
    User.findOne({email: email}).then((isExist) => {
        if(isExist) {
            return res.status(400).json({error: "Email is already exist"})
        }
        const user = new User({
            name,
            email,
            password
        })
        user.save().then(userSaved => {
            res.status(200).json({message: "Account created"})
        }).catch(error => {
            console.log(error);
        })
    }).catch(error => {
        console.log(error);
    })
});

module.exports = router;
