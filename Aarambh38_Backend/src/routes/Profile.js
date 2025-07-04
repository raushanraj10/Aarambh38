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

ProfileRouter.put("/Edituser",UserAuth,async(req,res)=>{
    const {fullName,gender,age,photourl}=req.body
    const decode=req.decode
    const data = await ModelUser.findOne({_id:decode})
    data.fullName=fullName
    data.gender=gender
    data.age=age
    data.photourl=photourl
    const finaldata=ModelUser(data)
    await finaldata.save();
    res.send("Update Successfully")
})

ProfileRouter.put("/Editalumni",UserAuth,async(req,res)=>{
    const {fullName,gender,age,photourl,about,company,role}=req.body
    const decode=req.decode

    const data = await ModelUser.findOne({_id:decode})
    data.fullName=fullName
    data.gender=gender
    data.age=age
    data.photourl=photourl
    data.company=company
    data.role=role
    data.about=about
    const finaldata=ModelAlumini(data)
    await finaldata.save();
    res.send("Update Successfully")
})






module.exports=ProfileRouter