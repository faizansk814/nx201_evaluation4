const Redis=require('ioredis')
require('dotenv').config()
let configuration={
    host:"redis-14853.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    port:14853,
    username:"default",
    password:process.env.redispassword
}
const redis=new Redis(configuration)

module.exports=redis