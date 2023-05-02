const express=require('express')
const connection=require('./connection/db')
const userrouter = require('./routes/user.router')
const iprouter = require('./routes/ip.router')
const auth = require('./middlware/auth')
require('dotenv').config()
const winston=require('winston')
const expresswinston=require('express-winston')
require('winston-mongodb')
const app=express()
app.use(express.json())
app.use(expresswinston.logger({
    transports: [
      new winston.transports.MongoDB({
        db:process.env.url,
        json: true,
        colorize: true,
        level:"error"
      })
    ],
    format:winston.format.prettyPrint()
   
  }));

app.use("/user",userrouter)
app.use(auth)
app.use("/ip",iprouter)
app.listen(process.env.port,async ()=>{
    await connection
    console.log("connected")
})