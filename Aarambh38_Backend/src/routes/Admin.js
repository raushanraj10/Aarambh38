const express=require("express")
const UserAuth = require("./middleware/UserAuth");
const ModelAdmin = require("../models/ModelAdmin");
const ModelAlumini = require("../models/ModelAlumini");
const ModelUser = require("../models/ModelUser");
const SendEmailToUserByAdmin = require("../utils/SendEmailToUserByAdmin");

const AdminRouter=express.Router()
const alumniselectdatalist="_id fullName gender collegeName emailId branch role company batch age photourl about mobileNumber registration"
const studentdatalist="_id fullName gender collegeName emailId branch batch age photourl mobileNumber registration"


AdminRouter.get("/getallalumni",UserAuth, async (req,res)=>{
    try{
    const AdminId = req.decode;
    const Admindata=await ModelAdmin.findOne({_id:AdminId}) 
    // if(Admindata.emailId==="aarambh38fromstart@gmail.com" || Admindata.emailId==="kumarraushanraj10@gamil.com")
    if(!Admindata)
        return res.status(400).send("Not Available Data")
    const AlumniList=await ModelAlumini.find({}).select(alumniselectdatalist)
    res.send(AlumniList)}
    catch(err){res.send(err.message)}
    
})

AdminRouter.get("/getallstudent",UserAuth, async (req,res)=>{
    try{
    const AdminId = req.decode;
    const Admindata=await ModelAdmin.findOne({_id:AdminId}) 
    // if(Admindata.emailId==="aarambh38fromstart@gmail.com" || Admindata.emailId==="kumarraushanraj10@gamil.com")
    if(!Admindata)
        return res.status(400).send("Not Available Data")
    const StudentList=await ModelUser.find({}).select(studentdatalist)
    res.send(StudentList)}
    catch(err){res.send(err.message)}
    
})

AdminRouter.delete("/deletestudent/:fromuserId",UserAuth, async (req,res)=>{
    try{
    const AdminId = req.decode;
    const Admindata=await ModelAdmin.findOne({_id:AdminId}) 
    const {fromuserId}=req.params
    // if(Admindata.emailId==="aarambh38fromstart@gmail.com" || Admindata.emailId==="kumarraushanraj10@gamil.com")
    if(!Admindata)
        return res.status(400).send("Not Available Data")
    const StudentList=await ModelUser.deleteOne({_id:fromuserId})
    res.send("Successfully Deleted")}
    catch(err){res.send(err.message)}
    
})

AdminRouter.delete("/deletealumni/:touserId", UserAuth,async (req,res)=>{
    try{
        
    const AdminId = req.decode;
    const Admindata=await ModelAdmin.findOne({_id:AdminId}) 
    const {touserId}=req.params
    console.log(touserId)
    // if(Admindata.emailId==="aarambh38fromstart@gmail.com" || Admindata.emailId==="kumarraushanraj10@gamil.com")
    if(!Admindata)
        return res.status(400).send("Not Available Data")
    const Alumnidata=await ModelAlumini.deleteOne({_id:touserId})
    res.send("Successfully Deleted")}
    catch(err){res.send(err.message)}
    
})


AdminRouter.post("/sendemailtouser", UserAuth, async (req, res) => {
  const { to, subject, message } = req.body;
  try {
    // Use nodemailer or SendGrid etc.
    console.log(message)
    await SendEmailToUserByAdmin({ to, subject,  message });
    res.status(200).send("Email sent successfully");
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).send("Email failed");
  }
});


module.exports=AdminRouter