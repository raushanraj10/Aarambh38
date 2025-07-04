const express =require("express");
const ModelUser = require("../models/ModelUser");
const validate =require("validator");
const validateBodyData = require("../utils/ValidateBodyData");
const SendEmail =require("../utils/SendEmail");
const ModelAlumini = require("../models/ModelAlumini");
const bcrypt =require("bcrypt");
const UserAuth = require("./middleware/UserAuth");

const ProfileRouter=express.Router()


ProfileRouter.get("/getlistalumini",UserAuth,  async (req,res)=>{
    const list=await ModelAlumini.find({}).select("fullName role collegeName batch photourl")
    // console.log(list)
    res.send(list)
})

ProfileRouter.get("/getliststudent",UserAuth,  async (req,res)=>{
    const list=await ModelUser.find({}).select("fullName collegeName batch photourl age gender")
    // console.log(list)
    res.send(list)
})








module.exports=ProfileRouter