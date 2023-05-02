const jwt=require('jsonwebtoken')
require('dotenv').config()
const redis = require('../redis')

const auth=async(req,res,next)=>{
    const token=req.headers?.authorization?.split(" ")[1]
    if(token){
        const isBlacklisted=await redis.get(token)
        if(isBlacklisted){
            return res.status(401).send({msg:"You have logged out login again"})
        }
        jwt.verify(token,process.env.secret,(err,decoded)=>{
            if(decoded){
                req.userID=decoded.userID
                next()
            }else{
                return res.status(501).send({msg:"Your session has expired"})
            }
        })
    }else{
        res.status(401).send({msg:"Login First"})
    }
}

module.exports=auth