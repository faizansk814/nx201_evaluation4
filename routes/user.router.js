const express = require('express')
const bcrypt = require('bcrypt')
const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const redis = require('../redis')
const userrouter = express.Router()

userrouter.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body
        const user = await UserModel.findOne({ email })
        if (user) {
            return res.status(401).send({ msg: "User already exists" })
        }
        bcrypt.hash(password, 5, async (err, hash) => {
            const newuser = new UserModel({ name, email, password: hash })
            await newuser.save()
            res.status(200).send({ msg: "Registration Succesful" })
        })
    } catch (error) {
        res.status(401).send({ msg: error.message })
    }
})


userrouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.send({ msg: "No such email exists" })
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                const token = jwt.sign({ userID: user._id }, process.env.secret, { expiresIn: "10h" })
                res.status(200).send({ msg: "Login succesful", token })
            } else {
                res.status(401).send({ msg: "Wrong credintials" })
            }
        })
    } catch (error) {
        res.status(401).send({ msg: error.message })
    }
})

userrouter.get("/logout", (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    if (token) {
        redis.set(token, 1, "EX", 30)
        res.status(200).send({ msg: "Logout Succesful" })
    } else {
        return res.send({ msg: "invalid request" })
    }

})

module.exports = userrouter