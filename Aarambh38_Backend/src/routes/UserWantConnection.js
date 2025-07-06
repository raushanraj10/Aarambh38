const express =require("express")
const UserAuth = require("./middleware/UserAuth");
const ModelUserSendConnection = require("../models/ModelUserSendConnection");

const UserRouter=express.Router()

UserRouter.post("/sendrequest/:touserId",UserAuth,async(req,res)=>{
    try{
  const touserId = req.params.touserId;
  const decode=req.decode._id
  //direct fromuserId me nhi ho rha
  const fromuserId=decode

  if(touserId===fromuserId)
    return res.send("Something Error")
  
 const checking=await ModelUserSendConnection.findOne({fromuserId:fromuserId,touserId:touserId})
 if(checking)
    return res.send("Can't Sent")
  const text=req.body.text
  // console.log(text)
const final=ModelUserSendConnection({
    fromuserId:fromuserId,
    touserId:touserId,
    text:text,
    status:"sended",
})
await final.save();
  res.send("Request Send")}
  catch(err){res.send(err.message)}
})

UserRouter.get("/finalsendrequestlist",UserAuth,async (req,res)=>{
  try{
    const decode=req.decode._id
  //direct fromuserId me nhi ho rha
  const fromuserId=decode
  const connections=await ModelUserSendConnection.find({fromuserId:fromuserId,status:"sended"}).select("touserId")
  const listoftouserId = connections.map(conn => conn.touserId);
  // console.log(listoftouserId)
  res.send(listoftouserId)

  }catch(err){res.send(err.message)}
})

UserRouter.get("/finallistusermessage",UserAuth,async (req,res)=>{
  try{
    const decode=req.decode._id
  //direct fromuserId me nhi ho rha
  const fromuserId=decode
  const connections=await ModelUserSendConnection.find({fromuserId:fromuserId,status:"accepted"}).select("touserId")
  const listoftouserId = connections.map(conn => conn.touserId);
  // console.log(listoftouserId)
  res.send(listoftouserId)

  }catch(err){res.send(err.message)}
})


UserRouter.get("/mymentors",UserAuth,async (req,res)=>{
  try{
    const decode=req.decode._id
  //direct fromuserId me nhi ho rha
  const fromuserId=decode
  const connections=await ModelUserSendConnection.find({fromuserId:fromuserId,status:"accepted"}).populate("touserId","_id photourl  fullName role company batch collegeName gender about").select("touserId")
  const listoftouserIddetails = connections.map(conn => conn.touserId);
  // console.log(listoftouserId)
  res.send(listoftouserIddetails)

  }catch(err){res.send(err.message)}
})

UserRouter.get("/getalumnimentees",UserAuth,async (req,res)=>{
  try{
    const decode=req.decode._id
  //direct fromuserId me nhi ho rha
  const fromuserId=decode
  const connections=await ModelUserSendConnection.find({touserId:fromuserId,status:"accepted"}).populate("fromuserId","_id photourl  fullName role company batch collegeName gender about").select("fromuserId")
  const listoftouserIddetails = connections.map(conn => conn.fromuserId);
  // console.log(listoftouserId)
  res.send(listoftouserIddetails)

  }catch(err){res.send(err.message)}
})

UserRouter.get("/alumnirecivedrequest",UserAuth,async (req,res)=>{
  try{
    const decode=req.decode._id
  //direct fromuserId me nhi ho rha
  const fromuserId=decode
  const connections=await ModelUserSendConnection.find({touserId:fromuserId,status:"sended"}).populate("fromuserId","_id photourl  fullName role company batch collegeName gender about").select("fromuserId")
  const listoftouserIddetails = connections.map(conn => conn.fromuserId);
  // console.log(listoftouserId)
  res.send(listoftouserIddetails)

  }catch(err){res.send(err.message)}
})



module.exports=UserRouter