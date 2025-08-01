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
const SendRequestEmail=require("../utils/EmailTheConnection");
const { cloudinary } = require("../utils/cloudinary");

const ProfileRouter=express.Router()


ProfileRouter.get("/getlistalumni",UserAuth,  async (req,res)=>{
    const list=await ModelAlumini.find({toshow:true}).select("fullName isshow role collegeName batch photourl age company gender about branch")
    // console.log(list)
    // if(toshow===false)
    //   return res.send("No such alumni")
    res.send(list)
})

ProfileRouter.get("/getliststudent",UserAuth,  async (req,res)=>{
    const list=await ModelUser.find({}).select("_id fullName collegeName batch photourl age gender branch")
    // console.log(list)
    res.send(list)
})

ProfileRouter.post("/edituser", UserAuth, async (req, res) => {
  try {
    const { fullName, gender, age, photourl } = req.body;
    const decode = req.decode;

    const data = await ModelUser.findOne({ _id: decode });
    if (!data) return res.status(404).send("User not found");

    data.fullName = fullName;
    data.gender = gender;
    data.age = age;

    // Upload new photo if provided
    if (photourl) {
      const uploadedImage = await cloudinary.uploader.upload(photourl);
      data.photourl = uploadedImage.secure_url;
    }

    await data.save();

    const updatedUser = await ModelUser.findOne({ _id: decode }).select("fullName emailId branch role collegeName batch photourl age company gender about")
    res.send(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});




ProfileRouter.post("/editalumni", UserAuth, async (req, res) => {
  try {
    const { fullName, gender, age, photourl, about, company, role } = req.body;
    const decode = req.decode;

    const data = await ModelAlumini.findOne({ _id: decode });
    if (!data) return res.status(404).send("Alumni not found");

    // Update fields
    data.fullName = fullName;
    data.gender = gender;
    data.age = age;
    data.company = company;
    data.role = role;
    data.about = about;

    // If a new photo is provided, upload and update
    if (photourl) {
      const uploadedImage = await cloudinary.uploader.upload(photourl);
      data.photourl = uploadedImage.secure_url;
    }

    await data.save();

    const updatedData = await ModelAlumini.findOne({ _id: decode }).select("fullName emailId role collegeName batch photourl age company gender about branch")
    res.send(updatedData);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});



ProfileRouter.post("/editadmin", UserAuth, async (req, res) => {
  try {
    const { fullName, gender, age, photourl } = req.body;
    const decode = req.decode;

    const data = await ModelAdmin.findOne({ _id: decode });
    if (!data) return res.status(404).send("Admin not found");

    // Update fields
    data.fullName = fullName;
    data.gender = gender;
    data.age = age;

    // Optional photo upload
    if (photourl) {
      const uploadedImage = await cloudinary.uploader.upload(photourl);
      data.photourl = uploadedImage.secure_url;
    }

    await data.save();

    const updatedData = await ModelAdmin.findOne({ _id: decode }).select("fullName age emailId gender photourl");
    res.send(updatedData);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});


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
  const finaldata=await ModelUser.findOne({_id:fromuserId._id}).select("fullName emailId branch collegeName batch photourl age gender")
  if(!finaldata)
    res.status(400).send("First Login")
  res.send(finaldata)
}
  catch(err){res.send(err.message)}
  
})

ProfileRouter.get("/getalumniprofile",UserAuth,async(req,res)=>{
  try{
  const fromuserId = req.decode;
  const finaldata=await ModelAlumini.findOne({_id:fromuserId._id}).select("fullName emailId role collegeName batch photourl age company gender about branch toshow")
  if(!finaldata)
    res.status(400).send("First Login")
  if(toshow===false)
    return res.send("No such alumni")
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

ProfileRouter.delete("/clearchat/:touserId",UserAuth,async(req,res)=>{
  try{
    // console.log("fdhsdjkfhsdfdf")
  const fromuserId = req.decode._id;
  // console.log(fromuserId)
  const {touserId}=req.params;
  // console.log(touserId)
  await ModelMessage.deleteMany({
  $or: [
    { fromuserId, targetuserId:touserId },
    { fromuserId: touserId, targetuserId: fromuserId }
  ]
});
  res.send("Delete successfully")
}
  catch(err){res.send(err.message)}
  
})



module.exports=ProfileRouter