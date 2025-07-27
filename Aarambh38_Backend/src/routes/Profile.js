const express =require("express");
const ModelUser = require("../models/ModelUser");
const validate =require("validator");
const validateBodyData = require("../utils/ValidateBodyData");
const SendEmail =require("../utils/SendEmail");
const ModelAlumini = require("../models/ModelAlumini");
const bcrypt =require("bcrypt");
const UserAuth = require("./middleware/UserAuth");
const ModelAdmin = require("../models/ModelAdmin");
const ModelMessage = require("../models/ModelMessage");
const SendRequestEmail=require("../utils/EmailTheConnection")

const ProfileRouter=express.Router()


ProfileRouter.get("/getlistalumni",UserAuth,  async (req,res)=>{
    const list=await ModelAlumini.find({}).select("fullName role collegeName batch photourl age company gender about branch")
    // console.log(list)
    res.send(list)
})

ProfileRouter.get("/getliststudent",UserAuth,  async (req,res)=>{
    const list=await ModelUser.find({}).select("_id fullName collegeName batch photourl age gender branch")
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

ProfileRouter.get("/getmessageswith/:targetuserId", UserAuth, async (req, res) => {
  try {
    const fromuserId = req.decode; // Logged-in user ID
    const { targetuserId } = req.params;

    const messages = await ModelMessage.find({
      $or: [
        { fromuserId: fromuserId, targetuserId: targetuserId },
        { fromuserId: targetuserId, targetuserId: fromuserId }
      ],
    }).sort({ createdAt: 1 });

    res.send(messages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

ProfileRouter.get("/getstudentprofile",UserAuth,async(req,res)=>{
  try{
  const fromuserId = req.decode;
  const finaldata=await ModelUser.findOne({_id:fromuserId._id}).select("fullName emailId branch role collegeName batch photourl age company gender about")
  if(!finaldata)
    res.status(400).send("First Login")
  res.send(finaldata)
}
  catch(err){res.send(err.message)}
  
})

ProfileRouter.get("/getalumniprofile",UserAuth,async(req,res)=>{
  try{
  const fromuserId = req.decode;
  const finaldata=await ModelAlumini.findOne({_id:fromuserId._id}).select("fullName emailId role collegeName batch photourl age company gender about branch")
  if(!finaldata)
    res.status(400).send("First Login")
  res.send(finaldata)
}
  catch(err){res.send(err.message)}
  
})

ProfileRouter.get("/getadminprofile",UserAuth,async(req,res)=>{
  try{
  const fromuserId = req.decode;
  const finaldata=await ModelAdmin.findOne({_id:fromuserId._id}).select("fullName emailId role collegeName batch photourl age company gender about branch")
  if(!finaldata)
    res.status(400).send("First Login")
  res.send(finaldata)
}
  catch(err){res.send(err.message)}
  
})

ProfileRouter.post("/sendrequestbymail",UserAuth,async (req,res)=>{
  const {alumniId,fromuserId,message}=req.body
  const dataAlumni=await ModelAlumini.findOne({_id:alumniId})
  const data=await ModelUser.findOne({_id:fromuserId})
  const emailId=dataAlumni.emailId
 SendRequestEmail({emailId,data,message})
 res.send("email sent")

})



module.exports=ProfileRouter