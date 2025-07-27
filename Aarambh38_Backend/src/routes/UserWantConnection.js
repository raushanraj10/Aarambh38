const express =require("express")
const UserAuth = require("./middleware/UserAuth");
const ModelUserSendConnection = require("../models/ModelUserSendConnection");
const ModelAlumini = require("../models/ModelAlumini");

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


UserRouter.get("/mymentors", UserAuth, async (req, res) => {
  try {
    const fromuserId = req.decode._id;

    const connections = await ModelUserSendConnection.find({
      fromuserId: fromuserId,
      status: "accepted"
    }).select("touserId");
    //  console.log(connections)
    const listoftouserIddetails = connections.map(conn => conn.touserId);
    //  console.log(listoftouserIddetails)
    // Use Promise.all to resolve all async calls
    const finaldata = await Promise.all(
      listoftouserIddetails.map(async (ele) => {
        return await ModelAlumini.findOne(
          { _id: ele },
          "_id fullName photourl role company batch collegeName gender branch about"
        );
      })
    );
    if(!finaldata)
      return;
    res.send(finaldata);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


UserRouter.get("/getalumnimentees",UserAuth,async (req,res)=>{
  try{
    const decode=req.decode._id
  //direct fromuserId me nhi ho rha
  const fromuserId=decode
  const connections=await ModelUserSendConnection.find({touserId:fromuserId,status:"accepted"}).populate("fromuserId","_id photourl  fullName role company batch collegeName gender about").select("fromuserId")
  const listoftouserIddetails = connections.map(conn => conn.fromuserId);
  // console.log(listoftouserId)
  if(!listoftouserIddetails)
  return;
  res.send(listoftouserIddetails)

  }catch(err){res.send(err.message)}
})

UserRouter.get("/alumnirecivedrequest",UserAuth,async (req,res)=>{
  try{
    const decode=req.decode._id
  //direct fromuserId me nhi ho rha
  const fromuserId=decode
  const connections=await ModelUserSendConnection.find({touserId:fromuserId,status:"sended"}).populate("fromuserId","_id photourl  fullName role company batch collegeName gender about").select("fromuserId text")
  // const listoftouserIddetails = connections.map(conn => conn.fromuserId);
  // console.log(connections)
  if(!connections)return;
  res.send(connections)

  }catch(err){res.send(err.message)}
})

UserRouter.get("/alumniblocked",UserAuth,async (req,res)=>{
  try{
    const decode=req.decode._id
  //direct fromuserId me nhi ho rha
  const fromuserId=decode
  const connections=await ModelUserSendConnection.find({touserId:fromuserId,status:"blocked"}).populate("fromuserId","_id photourl  fullName role company batch collegeName gender about").select("fromuserId text")
  // const listoftouserIddetails = connections.map(conn => conn.fromuserId);
  // console.log(connections)
  if(!connections)return;
  res.send(connections)

  }catch(err){res.send(err.message)}
})


UserRouter.post("/alumni/:status/:fromuserId",UserAuth,async (req,res)=>{
  try{
    const fromuserId=req.params.fromuserId
    const status=req.params.status
    const decode=req.decode._id
    // console.log("khfjksdhfk")
  //direct fromuserId me nhi ho rha
  const touserId=decode

  const  validstatus=["accepted","rejected","blocked"]
  if(!validstatus.includes(status))
    return res.status(400).send("not valid status")

  const checking = await ModelUserSendConnection.findOne({
  $or: [
    { fromuserId: fromuserId, touserId: touserId, status: "sended" },
    { fromuserId: fromuserId, touserId: touserId, status: "blocked" },
  ],
});
  // console.log("hsdhfksdf")
  if(!checking)
    return res.status(400).send("Connection not found or already handled")

  if(status==="rejected")
    {await ModelUserSendConnection.deleteOne({fromuserId:fromuserId,touserId:touserId,status:"sended"})
     return res.send("Request "+status)}

  checking.status=status
  //  const realdata=ModelUserSendConnection(checking)
  //  console.log(checking)
   await checking.save()  
  res.send("Request "+status)

  }catch(err){res.send(err.message)}
})




module.exports=UserRouter