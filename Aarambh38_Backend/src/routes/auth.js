const express =require("express")

const AuthRouter=express.Router()

AuthRouter.post("/signup",(req,res)=>{
    res.send("form sgnup")
})
module.exports=AuthRouter