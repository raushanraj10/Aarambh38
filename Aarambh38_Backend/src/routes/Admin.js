const express=require("express")
const UserAuth = require("./middleware/UserAuth");
const ModelAdmin = require("../models/ModelAdmin");
const ModelAlumini = require("../models/ModelAlumini");
const ModelUser = require("../models/ModelUser");
const SendEmailToUserByAdmin = require("../utils/SendEmailToUserByAdmin");
const AlumniAcceptanceEmail = require("../utils/AlumniAcceptanceEmail");

const AdminRouter=express.Router()
const alumniselectdatalist="_id fullName gate gender collegeName emailId branch role company batch age photourl about mobileNumber registration createdAt"
const studentdatalist="_id fullName gender collegeName emailId branch batch age photourl mobileNumber registration createdAt"


AdminRouter.get("/getallalumni",UserAuth, async (req,res)=>{
    try{
    const AdminId = req.decode;
    const Admindata=await ModelAdmin.findOne({_id:AdminId}) 
    
    if(!Admindata)
        return res.status(400).send("Not Available Data")
    const AlumniList=await ModelAlumini.find({toshow:true}).select(alumniselectdatalist)
    res.send(AlumniList)}
    catch(err){res.send(err.message)}
    
})

AdminRouter.get("/getallstudent",UserAuth, async (req,res)=>{
    try{
    const AdminId = req.decode;
    const Admindata=await ModelAdmin.findOne({_id:AdminId}) 
   
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
    const Studentdata=await ModelUser.findOne({_id:fromuserId})

    if(Studentdata.collegeName!==Admindata.collegeName)
        return res.status(400).send("Illegal Action college must be same")

    await ModelUser.deleteOne({_id:fromuserId})
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
    const AlumniData= await ModelAlumini.findOne({_id:touserId})
    if(AlumniData.collegeName!==Admindata.collegeName)
     return res.status(400).send("Illegal Action college must be same")

    await ModelAlumini.deleteOne({_id:touserId})
    res.send("Successfully Deleted")}
    catch(err){res.send(err.message)}
    
})


AdminRouter.post("/sendemailtouser", UserAuth, async (req, res) => {
  const { to, subject, message } = req.body;
  try {
    // console.log(to)
     const AdminId = req.decode;
const Admindata = await ModelAdmin.findOne({ _id: AdminId });
const AlumniData = await ModelAlumini.findOne({ emailId: to });
const Studentdata = await ModelUser.findOne({ emailId: to });

if (
  (AlumniData && AlumniData.collegeName !== Admindata.collegeName) ||
  (Studentdata && Studentdata.collegeName !== Admindata.collegeName)
) {
  return res.status(400).send("Illegal Action: College must be same");
}


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
    const alumnidata=await ModelAlumini.findOne({_id:id})
    if(Admindata.collegeName!==alumnidata.collegeName)
        return res.status(400).send("Illegal Action college must be same")
    if(action==="Reject")
    {
        await ModelAlumini.deleteOne({_id:id})
        return res.send("Request Action Taken Successfull")
    }
   
    alumnidata.toshow=true
    await alumnidata.save();
    const {emailId,fullName}=alumnidata
    AlumniAcceptanceEmail({emailId,fullName})

    res.send("Request Action Taken Successfull")}
    catch(err){res.send(err.message)}
    
})


module.exports=AdminRouter