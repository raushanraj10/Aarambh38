const express=require("express")
const UserAuth = require("./middleware/UserAuth");
const ModelAdmin = require("../models/ModelAdmin");
const ModelAlumini = require("../models/ModelAlumini");
const ModelUser = require("../models/ModelUser");
const SendEmailToUserByAdmin = require("../utils/SendEmailToUserByAdmin");
const AlumniAcceptanceEmail = require("../utils/AlumniAcceptanceEmail");
const StudentRejectionEmail = require("../utils/StudentRejectionEmail");
const AlumniRejectionEmail = require("../utils/AlumniRejectionEmail");

const AdminRouter=express.Router()
const alumniselectdatalist="_id fullName linkedinshow gate gender collegeName emailId branch role company batch age photourl about mobileNumber registration createdAt"
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
    const StudentList=await ModelUser.find({reach:true}).select(studentdatalist)
    res.send(StudentList)}
    catch(err){res.send(err.message)}
    
})

AdminRouter.delete("/deletestudent/:fromuserId",UserAuth, async (req,res)=>{
    try{
    const AdminId = req.decode;
    const Admindata=await ModelAdmin.findOne({_id:AdminId}) 
    const {fromuserId}=req.params
    
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
    // console.error("Email error:", err);
    res.status(500).send("Email failed");
  }
});

AdminRouter.get("/getallrequestedalumni",UserAuth, async (req,res)=>{
    try{
    const AdminId = req.decode;
    const Admindata=await ModelAdmin.findOne({_id:AdminId}) 
   
    if(!Admindata)
        return res.status(400).send("No Admin Found")
    const AlumniList=await ModelAlumini.find({toshow:false}).select(alumniselectdatalist)
    res.send(AlumniList)}
    catch(err){res.send(err.message)}
    
})


AdminRouter.get("/getallrequestedstudent",UserAuth, async (req,res)=>{
    try{
    const AdminId = req.decode;
    const Admindata=await ModelAdmin.findOne({_id:AdminId}) 
   
    if(!Admindata)
        return res.status(400).send("No Admin Found")
    const StudentList=await ModelUser.find({reach:false}).select(studentdatalist)
    res.send(StudentList)}
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
        const {emailId,fullName}=alumnidata
        await AlumniRejectionEmail({emailId,fullName})
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




AdminRouter.post("/studentrequest/:id/:action", UserAuth, async (req, res) => {
  try {
    const AdminId = req.decode;
    const adminData = await ModelAdmin.findOne({ _id: AdminId });

    const { id, action } = req.params;
    const allowedActions = ["Approved", "Reject"];
    if (!allowedActions.includes(action)) {
      return res.status(400).send("Illegal Action");
    }

    const studentData = await ModelUser.findOne({ _id: id });
    if (!studentData) return res.status(404).send("Student not found");

    if (adminData.collegeName !== studentData.collegeName) {
      return res.status(400).send("Illegal Action: college must be same");
    }

    const { emailId, fullName } = studentData;

    if (action === "Reject") {
    //   console.log("Sending rejection email to:", emailId);
      await StudentRejectionEmail({ emailId, fullName });
      await ModelUser.deleteOne({ _id: id });
      return res.send("Request action taken successfully");
    }

    // Approve action
    studentData.reach = true; // or 'toshow' if you prefer
    await studentData.save();
    // console.log("Sending approval email to:", emailId);
    await AlumniAcceptanceEmail({ emailId, fullName });

    res.send("Request action taken successfully");
  } catch (err) {
    // console.error(err.message);
    res.status(500).send(err.message);
  }
});
;


module.exports=AdminRouter