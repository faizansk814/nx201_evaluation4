const mongoose=require('mongoose')

const uservisitedSchema=mongoose.Schema({
    userID:String,
    visitedip:Array
})

const Uservisited=mongoose.model("visited",uservisitedSchema)

module.exports=Uservisited