const express =require("express")
const UserAuth = require("./middleware/UserAuth");
const ModelUserSendConnection = require("../models/ModelUserSendConnection");
const ModelAlumini = require("../models/ModelAlumini");
const SendEmailByUser = require("../utils/SendEmailByUser");
const Requestonlineemail = require("../utils/RequestOnlineEmail");
const ModelUser = require("../models/ModelUser");
const ModelMessage = require("../models/ModelMessage");
const mongoose = require("mongoose");
const SendAcceptanceEmail = require("../utils/SendAcceptanceEmail");
const SendRejectanceEmail = require("../utils/SendRejectanceEmail");
const Group = require("../models/Group");
const GroupMessage = require("../models/GroupMessage");



const UserRouter=express.Router()

UserRouter.post("/sendrequest/:touserId",UserAuth,async(req,res)=>{
    try{
  const touserId = req.params.touserId;
  // console.log(touserId)
  const decode=req.decode._id
  //direct fromuserId me nhi ho rha
  const fromuserId=decode
  // console.log(fromuserId)

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

    // Step 1: Find all accepted connections from this user
    const connections = await ModelUserSendConnection.find({
      fromuserId: fromuserId,
      status: "accepted"
    }).select("touserId");

    // Step 2: Extract the list of touserIds
    const listoftouserIddetails = connections.map(conn => conn.touserId);

    if (!listoftouserIddetails || listoftouserIddetails.length === 0) {
      return res.status(404).send({ message: "No mentors found" });
    }

    // Step 3: Fetch all alumni in one query instead of looping with Promise.all
    const finaldata = await ModelAlumini.find(
      { _id: { $in: listoftouserIddetails } },
      "_id fullName role company batch collegeName gender branch about gate photourl"
    );

    // Step 4: Handle case where no valid alumni are found
    if (!finaldata || finaldata.length === 0) {
      return res.status(404).send({ message: "No mentors found" });
    }

    // Step 5: Send the valid mentor data
    res.send(finaldata);

  } catch (err) {
    // console.error("Error in /mymentors:", err);
    res.status(500).send({ error: err.message });
  }
});


UserRouter.get("/getalumnimentees",UserAuth,async (req,res)=>{
  try{
    const decode=req.decode._id
  //direct fromuserId me nhi ho rha
  const fromuserId=decode
  const connections=await ModelUserSendConnection.find({touserId:fromuserId,status:"accepted"}).populate("fromuserId","_id photourl age fullName batch collegeName gender branch").select("fromuserId")
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
  const connections=await ModelUserSendConnection.find({touserId:fromuserId,status:"sended"}).populate("fromuserId","_id photourl  fullName role age company batch collegeName gender branch about").select("fromuserId text")
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
  const connections=await ModelUserSendConnection.find({touserId:fromuserId,status:"blocked"}).populate("fromuserId","_id photourl  fullName batch collegeName gender age branch").select("fromuserId text")
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


      const dataOfAlumni=await ModelAlumini.findOne({_id:touserId})
      const studentemailId=await ModelUser.findOne({_id:fromuserId})
      const emailId=studentemailId.emailId 
      
      
  if(status==="rejected")
    {await ModelUserSendConnection.deleteOne({fromuserId:fromuserId,touserId:touserId,status:"sended"})
      const {fullName,collegeName,company,role,batch}=dataOfAlumni
     await SendRejectanceEmail({fullName,collegeName,company,role,batch,emailId})
    return res.send("Request "+status)
    }

     if(status==="accepted")
     {
      
      const {fullName,collegeName,company,role,batch}=dataOfAlumni
      await SendAcceptanceEmail({fullName,collegeName,company,role,batch,emailId})
     }
  checking.status=status
  //  const realdata=ModelUserSendConnection(checking)
  //  console.log(checking)
   await checking.save()  
  res.send("Request "+status)

  }catch(err){res.send(err.message)}
})


UserRouter.get("/alumniblockstudent/:fromuserId",UserAuth,async (req,res)=>{
  try{
    const touserId=req.params.fromuserId
    const fromuserId=req.decode._id
    // console.log(touserId)
  //direct fromuserId me nhi ho rha
  // const touserId=decode

  
  const checking = await ModelUserSendConnection.findOne({
  
    fromuserId: touserId, touserId: fromuserId, status: "accepted"
   

});
  // console.log("hsdhfksdf")
  if(!checking)
    return res.status(400).send("Connection not found or already handled")

 

  checking.status="blocked"
  //  const realdata=ModelUserSendConnection(checking)
  //  console.log(checking)
   await checking.save()  
  res.send("Blocked")

  }catch(err){res.send(err.message)}
})


UserRouter.get("/deletealumnibystudent/:fromuserId",UserAuth,async (req,res)=>{
  try{
    const touserId=req.params.fromuserId
    const fromuserId=req.decode._id
    // console.log(touserId)
  //direct fromuserId me nhi ho rha
  // const touserId=decode

  
  const checking = await ModelUserSendConnection.deleteOne({
  
    fromuserId: fromuserId, touserId: touserId, status: "accepted"
   

});
  // console.log("hsdhfksdf")
  if(!checking)
    return res.status(400).send("Connection not found or already handled")

 

  // checking.status="sended"
  //  const realdata=ModelUserSendConnection(checking)
  //  console.log(checking)
  //  await checking.save()  
  res.send("delete from u")

  }catch(err){res.send(err.message)}
})


UserRouter.get("/deletestudentbyalumni/:fromuserId",UserAuth,async (req,res)=>{
  try{
    const fromuserId=req.params.fromuserId
    const touserId=req.decode._id
    // console.log(touserId)
  //direct fromuserId me nhi ho rha
  // const touserId=decode

  
  const checking = await ModelUserSendConnection.deleteOne({
  
    fromuserId: fromuserId, touserId: touserId, status: "accepted"
   

});
  // console.log("hsdhfksdf")
  if(!checking)
    return res.status(400).send("Connection not found or already handled")

 

  // checking.status="sended"
  //  const realdata=ModelUserSendConnection(checking)
  //  console.log(checking)
  //  await checking.save()  
  res.send("delete from u")

  }catch(err){res.send(err.message)}
})



UserRouter.post("/sendemailbyuser", async (req, res) => {
  const { useremail, subject, usermessage } = req.body;
  try {
    await SendEmailByUser({
      useremail,
      subject,
      usermessage,
    });
    res.status(200).send("Email sent successfully");
  } catch (err) {
    // console.error("Email error:", err);
    res.status(500).send("Email failed");
  }
});


UserRouter.post("/requestonlineemail/:Id", UserAuth,async (req, res) => {
  try {
    
    const Id=req.params.Id
    const {fullName}=req?.body
    const check=await ModelUser.findOne({_id:Id})
    if(!check)
      res.status(400).send("Email Can't Send");
    const emailId=check.emailId
    // console.log(emailId)
    
    await Requestonlineemail({
      emailId,fullName
    });
    res.status(200).send("Email sent successfully");
  } catch (err) {
    // console.error("Email error:", err);
    res.status(500).send("Email failed");
  }
});


UserRouter.get("/alumnireadedoff/:fromuserId", UserAuth,async (req, res) => {
  try {
    // console.log("hsdufhsd")
    const fromuserId=req.params.fromuserId
     const targetuserId=req.decode._id
     const listofstudentofunread = await ModelMessage.find({
  targetuserId,
  alumnireaded: "NO",
  fromuserId
});

if (!listofstudentofunread || listofstudentofunread.length === 0) {
  return res.send("off"); // no unread messages
}

// update all matching docs
await ModelMessage.updateMany(
  { targetuserId, alumnireaded: "NO", fromuserId },
  { $set: { alumnireaded: "YES" } }
);

return res.send("updated")}  
    
  catch(err){res.send(err.message)}
});

UserRouter.get("/alumnireaded", UserAuth, async (req, res) => {
  try {
    const targetuserId = req.decode._id;

    // Distinct ensures all IDs are unique
    const unreadIds = await ModelMessage.distinct("fromuserId", {
      targetuserId,
      alumnireaded: "NO"
    });

    // Convert ObjectIds to string for frontend
    const idsAsStrings = unreadIds.map(id => id.toString());
    // console.log(idsAsStrings)
    res.json(idsAsStrings);
  } catch (err) {
    // console.error("Error in /alumnireaded:", err);
    res.status(500).send(err.message);
  }
});



UserRouter.get("/studentreaded", UserAuth, async (req, res) => {
  try {
    const targetuserId = req.decode._id;

    // Disable caching completely
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.set("Surrogate-Control", "no-store");
    res.set("ETag", ""); // disable ETag

    const unreadIds = await ModelMessage.distinct("fromuserId", {
      targetuserId,
      studentreaded: "NO"
    });

    const idsAsStrings = unreadIds.map(id => id.toString());
    res.json(idsAsStrings);
  } catch (err) {
    // console.error("Error in /studentreaded:", err);
    res.status(500).send(err.message);
  }
});




UserRouter.get("/studentreadedoff/:fromuserId", UserAuth, async (req, res) => {
  try {
    const fromuserId = req.params.fromuserId;   // this matches your route param
    const targetuserId = req.decode._id;        // current logged in user

    if (!fromuserId) {
      return res.status(400).send("fromuserId is required");
    }

    // validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(fromuserId)) {
      return res.status(400).send("Invalid fromuserId");
    }

    const listofstudentofunread = await ModelMessage.find({
      targetuserId,
      studentreaded: "NO",
      fromuserId,
    });

    // console.log(listofstudentofunread);

    if (!listofstudentofunread || listofstudentofunread.length === 0) {
      return res.send("off"); // no unread messages
    }

    await ModelMessage.updateMany(
      { targetuserId, studentreaded: "NO", fromuserId },
      { $set: { studentreaded: "YES" } }
    );

    res.send("off");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ===============================
// GROUP CHAT (ALUMNI ONLY)
// ===============================

// ✅ Create group (Alumni → connected students only)
UserRouter.post("/creategroup", UserAuth, async (req, res) => {
  try {
    const alumniId = req.decode._id;
    const { groupName, studentIds } = req.body;

    if (!groupName || !Array.isArray(studentIds)) {
      return res.status(400).send("Invalid data");
    }

    // get accepted students of alumni
    const connections = await ModelUserSendConnection.find({
      touserId: alumniId,
      status: "accepted",
    }).select("fromuserId");

    const allowedStudents = connections.map(c => c.fromuserId.toString());

    const invalid = studentIds.filter(
      id => !allowedStudents.includes(id)
    );

    if (invalid.length > 0) {
      return res.status(403).send("Only connected students allowed");
    }

    const group = await Group.create({
      name: groupName,
      createdBy: alumniId,
      members: [alumniId, ...studentIds],
    });

    res.status(201).json(group);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ✅ Get my groups (Alumni + Students)
UserRouter.get("/mygroups", UserAuth, async (req, res) => {
  try {
    const userId = req.decode._id;
    const groups = await Group.find({ members: userId });
    res.json(groups);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ✅ Get group messages
UserRouter.get("/groupmessages/:groupId", UserAuth, async (req, res) => {
  try {
    const userId = req.decode._id;
    const group = await Group.findById(req.params.groupId);

    if (!group) return res.status(404).send("Group not found");
    if (!group.members.includes(userId))
      return res.status(403).send("Not authorized");

    const messages = await GroupMessage.find({
      groupId: req.params.groupId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ✅ Add student to group (Alumni only)
UserRouter.post("/addtogroup/:groupId/:studentId", UserAuth, async (req, res) => {
  try {
    const alumniId = req.decode._id;
    const { groupId, studentId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).send("Group not found");

    if (group.createdBy.toString() !== alumniId) {
      return res.status(403).send("Only alumni admin can add");
    }

    const connection = await ModelUserSendConnection.findOne({
      fromuserId: studentId,
      touserId: alumniId,
      status: "accepted",
    });

    if (!connection) {
      return res.status(403).send("Student not connected");
    }

    if (!group.members.includes(studentId)) {
      group.members.push(studentId);
      await group.save();
    }

    res.send("Student added");
  } catch (err) {
    res.status(500).send(err.message);
  }
});



module.exports=UserRouter
