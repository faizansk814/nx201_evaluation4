const express=require('express')
const axios=require('axios')
const redis = require('../redis')
const Uservisited = require('../models/uservisited')
const iprouter=express.Router()

iprouter.get("/info",async (req,res)=>{
   const ip=req.query.ip
    const cachedata=await redis.get(ip)
    if(cachedata){
        console.log("from redis")
        return res.status(200).send(cachedata)
    }else{
        const response=await axios.get(`https://ipapi.co/${ip}/json/`)
        const data=response.data
        redis.set(ip,JSON.stringify(data),"EX",60*60*6)
        console.log("form axios")
        await Uservisited.findOneAndUpdate({userID:req.userID},{
            userID:req.userID,
            $push:{visitedip:ip}
        },{new:true,upsert:true})
        res.status(200).send(data)
    }
})
iprouter.get("/visitedip",async (req,res)=>{
    const visitedip=await Uservisited.findOne({userID:req.userID})
    res.send(visitedip)
})

module.exports=iprouter