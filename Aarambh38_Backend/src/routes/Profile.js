const express =require("express");
const ModelUser = require("../models/ModelUser");
const validate =require("validator");
const validateBodyData = require("../utils/ValidateBodyData");
const SendEmail =require("../utils/SendEmail");
const ModelAlumini = require("../models/ModelAlumini");
const bcrypt =require("bcrypt");
const UserAuth = require("./middleware/UserAuth");
const ModelAdmin = require("../models/ModelAdmin");

const ProfileRouter=express.Router()


ProfileRouter.get("/getlistalumni",UserAuth,  async (req,res)=>{
    const list=await ModelAlumini.find({}).select("fullName role collegeName batch photourl age company gender about")
    // console.log(list)
    res.send(list)
})

ProfileRouter.get("/getliststudent",UserAuth,  async (req,res)=>{
    const list=await ModelUser.find({}).select("_id fullName collegeName batch photourl age gender")
    // console.log(list)
    res.send(list)
})

ProfileRouter.patch("/edituser",UserAuth,async(req,res)=>{
    try{
    const {fullName,gender,age,photourl}=req.body
    const decode=req.decode
    const data = await ModelUser.findOne({_id:decode})
    data.fullName=fullName
    data.gender=gender
    data.age=age
    data.photourl=photourl
    const finaldata=ModelUser(data)
    await finaldata.save();
    const realdata=await ModelUser.findOne({_id:decode})
    res.send(realdata)}
    catch(err){res.send(err.message)}
})

ProfileRouter.patch("/editalumni",UserAuth,async(req,res)=>{
    try{
    const {fullName,gender,age,photourl,about,company,role}=req.body
    const decode=req.decode
    console.log(photourl)
    const data = await ModelAlumini.findOne({_id:decode})
    console.log(data)
    data.fullName=fullName
    data.gender=gender
    data.age=age
    data.photourl=photourl
    data.company=company
    data.role=role
    data.about=about
    const finaldata=ModelAlumini(data)
    await finaldata.save();
    const realdata=await ModelAlumini.findOne({_id:decode})
    res.send(realdata)}
    catch(err){res.send(err.message)}
})


ProfileRouter.patch("/editadmin",UserAuth,async(req,res)=>{
    try{
    const {fullName,gender,age,photourl}=req.body
    const decode=req.decode
    const data = await ModelAdmin.findOne({_id:decode})
    data.fullName=fullName
    data.gender=gender
    data.age=age
    data.photourl=photourl
    const finaldata=ModelAdmin(data)
    await finaldata.save();
    const realdata=await ModelAdmin.findOne({_id:decode})
    res.send(realdata)}
    catch(err){res.send(err.message)}
})






module.exports=ProfileRouter