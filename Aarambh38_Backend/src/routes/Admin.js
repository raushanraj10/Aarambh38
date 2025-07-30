const express=require("express")
const UserAuth = require("./middleware/UserAuth");
const ModelAdmin = require("../models/ModelAdmin");
const ModelAlumini = require("../models/ModelAlumini");
const ModelUser = require("../models/ModelUser");
const SendEmailToUserByAdmin = require("../utils/SendEmailToUserByAdmin");
const AlumniAcceptanceEmail = require("../utils/AlumniAcceptanceEmail");

const AdminRouter=express.Router()
const alumniselectdatalist="_id fullName isshow gender collegeName emailId branch role company batch age photourl about mobileNumber registration"
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
    // console.log(touserId)
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
    // console.log(message)
    await SendEmailToUserByAdmin({ to, subject,  message });
    res.status(200).send("Email sent successfully");
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).send("Email failed");
  }
});

AdminRouter.get("/getallrequestedalumni",UserAuth, async (req,res)=>{
    try{
    const AdminId = req.decode;
    const Admindata=await ModelAdmin.findOne({_id:AdminId}) 
    // if(Admindata.emailId==="aarambh38fromstart@gmail.com" || Admindata.emailId==="kumarraushanraj10@gamil.com")
    if(!Admindata)
        return res.status(400).send("No Admin Found")
    const AlumniList=await ModelAlumini.find({toshow:false}).select(alumniselectdatalist)
    res.send(AlumniList)}
    catch(err){res.send(err.message)}
    
})

AdminRouter.post("/alumnirequest/:id/:action",UserAuth, async (req,res)=>{
    try{
        // console.log("fhsdufhksf")
    const AdminId = req.decode;
    const Admindata=await ModelAdmin.findOne({_id:AdminId}) 
    const {id,action}=req.params
    // console.log(action)
    const checkaction=["Approved","Reject"]
    if(!checkaction.includes(action))
        return res.status(400).send("Illegal Action")
    
    if(action==="Reject")
    {
        await ModelAlumini.deleteOne({_id:id})
        return res.send("Request Action Taken Successfull")
    }
    const alumnidata=await ModelAlumini.findOne({_id:id})
    alumnidata.toshow=true
    await alumnidata.save();
    const {emailId,fullName}=alumnidata
    AlumniAcceptanceEmail({emailId,fullName})

    res.send("Request Action Taken Successfull")}
    catch(err){res.send(err.message)}
    
})


module.exports=AdminRouter