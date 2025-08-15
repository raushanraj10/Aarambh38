const express =require("express");
const ModelUser = require("../models/ModelUser");
const validate =require("validator");
const validateBodyData = require("../utils/ValidateBodyData");
const SendEmail =require("../utils/SendEmail");
const ModelAlumini = require("../models/ModelAlumini");
const bcrypt =require("bcrypt")
const jwt =require("jsonwebtoken")
const UserAuth=require("./middleware/UserAuth");
const ModelAdmin = require("../models/ModelAdmin");
const EmailAlumniRequest = require("../utils/EmailAlumniRequest");
const ModelOtp = require("../models/ModelOtp");
const ModelOtpAdmin=require("../models/ModelOtpAdmin")

const AuthRouter=express.Router()

AuthRouter.post("/sendemail",async (req,res)=>{
    try{
    const code = Math.floor(Math.random() * 900000) + 100000;
    const {emailId}=req.body
    const tempdata=ModelOtp({emailId:emailId,code:code})
    await tempdata.save();
    console.log(code)
    await SendEmail(emailId,code)
    res.send("Email Sent")
}
    catch(err){console.log(err.message)}
})

AuthRouter.post("/sendemailadmin",async (req,res)=>{
    try{
    const code = Math.floor(Math.random() * 900000) + 100000;
    // const emailId="aarambh38fromstart@gmail.com"
     const {emailId,fullName}=req.body
    
    const tempdata=ModelOtpAdmin({emailId:emailId,code:code,fullName:fullName})
    await tempdata.save();
    // console.log(code)
    const email="aarambh38fromstart@gmail.com"
    await SendEmail(email,code)
    res.send("Email Sent")
}
    catch(err){res.send(err.message)}
})
AuthRouter.post("/signupuser",async (req,res)=>{
    
    
    try{
        const data=req.body;
    const {emailId,code}=req.body
    const CheckFirst=await ModelOtp.findOne({emailId:emailId})
    // console.log(CheckFirst)
    if(!CheckFirst)
        return res.status(400).send("May email already exist or re-register")
    if (Number(CheckFirst.code) !== Number(code))
    return res.status(400).send("Wrong OTP");
    
    await ModelOtp.deleteOne({emailId:emailId})
    const requiredFields=["fullName","gender","emailId","newPassword","confirmPassword","registration","age","collegeName","branch","photourl"]
    
     const allFieldsPresent = requiredFields.every(field => field in data);

    if (!allFieldsPresent) {
        const missingFields = requiredFields.filter(field => !(field in data));
        return res.status(400).send("Missing fields: " + missingFields.join(", "));
    }
    // .include not working because data is object and requiredfields are array use "in" keyword
    const data1=validateBodyData(req,res);
    if(data1)return

    const checkemailid=await ModelUser.findOne({emailId:req.body.emailId})
    if(checkemailid)
        return res.status(400).send("Email already exist")
    const checkemailid2=await ModelAlumini.findOne({emailId:req.body.emailId})
    if(checkemailid2)
        return res.status(400).send("Email already exist")
    const checkemailid3=await ModelAdmin.findOne({emailId:req.body.emailId})
    if(checkemailid3)
        return res.status(400).send("Email already exist")

    if(req.body.newPassword!==req.body.confirmPassword)
        return res.status(400).send("Password not match")

    const {newPassword,confirmPassword}=req.body



    const hashnewPassword=await bcrypt.hash(newPassword,10)
    const hashconfirmPassword=await bcrypt.hash(confirmPassword,10)

    data.newPassword=hashnewPassword;
    data.confirmPassword=hashconfirmPassword


    
    const finalData=ModelUser(data)
    await finalData.save()
    
    res.send("Signup Successfully")}
    catch(err){console.log(err)}
    

})

AuthRouter.post("/signupalumini",async (req,res)=>{
    
    const data=req.body;
    
    const {emailId,code}=req.body
    const CheckFirst=await ModelOtp.findOne({emailId:emailId})
    if(!CheckFirst)
        return res.status(400).send("May email already exist or re-register")
   if (Number(CheckFirst.code) !== Number(code))
    return res.status(400).send("Wrong OTP");

    await ModelOtp.deleteOne({emailId:emailId})
    const requiredFields=["fullName","gender","emailId","newPassword","confirmPassword","registration","batch","collegeName","company","role","photourl","about","branch"]
    
     const allFieldsPresent = requiredFields.every(field => field in data);

    if (!allFieldsPresent) {
        const missingFields = requiredFields.filter(field => !(field in data));
        return res.status(400).send("Missing fields: " + missingFields.join(", "));
    }
    // .include not working because data is object and requiredfields are array use "in" keyword
    const data1=validateBodyData(req,res);
    if(data1)
        return;

    const checkemailid=await ModelUser.findOne({emailId:req.body.emailId})
    if(checkemailid)
        return res.status(400).send("Email already exist")
    const checkemailid2=await ModelAlumini.findOne({emailId:req.body.emailId})
    if(checkemailid2)
        return res.status(400).send("Email already exist")
    const checkemailid3=await ModelAdmin.findOne({emailId:req.body.emailId})
    if(checkemailid3)
        return res.status(400).send("Email already exist")

    if(req.body.newPassword!==req.body.confirmPassword)
        return res.status(400).send("Password not match")


    const {newPassword,confirmPassword}=req.body

    const hashnewPassword=await bcrypt.hash(newPassword,10)
    const hashconfirmPassword=await bcrypt.hash(confirmPassword,10)

    data.newPassword=hashnewPassword;
    data.confirmPassword=hashconfirmPassword
    
    const finalData=ModelAlumini(data)
    await finalData.save()
    EmailAlumniRequest(req.body)
    
    res.send("Signup Successfully")
    

})






AuthRouter.post("/signupadmin",async (req,res)=>{
    
try{
    const data=req.body;
    
    const {emailId,code,admincode}=req.body
    const CheckFirst=await ModelOtp.findOne({emailId:emailId})
    if(!CheckFirst)
        return res.status(400).send("May email already exist or re-register")
    if (Number(CheckFirst.code) !== Number(code))
    return res.status(400).send("Wrong OTP1");
const CheckFirst2=await ModelOtpAdmin.findOne({emailId:emailId})
    if(!CheckFirst2)
        return res.status(400).send("May email already exist or again try")
    if (Number(CheckFirst2.code) !== Number(admincode))
    return res.status(400).send("Wrong OTP2");
    
    const requiredFields=["fullName","gender","emailId","newPassword","confirmPassword","age","photourl"]
    
     const allFieldsPresent = requiredFields.every(field => field in data);

    if (!allFieldsPresent) {
        const missingFields = requiredFields.filter(field => !(field in data));
        return res.status(400).send("Missing fields: " + missingFields.join(", "));
    }
    // .include not working because data is object and requiredfields are array use "in" keyword
    // validateBodyData(req,res);

    const checkemailid=await ModelUser.findOne({emailId:req.body.emailId})
    if(checkemailid)
        return res.status(400).send("Email already exist")
    const checkemailid2=await ModelAlumini.findOne({emailId:req.body.emailId})
    if(checkemailid2)
        return res.status(400).send("Email already exist")
    const checkemailid3=await ModelAdmin.findOne({emailId:req.body.emailId})
    if(checkemailid3)
        return res.status(400).send("Email already exist")

    if(req.body.newPassword!==req.body.confirmPassword)
        return res.status(400).send("Password not match")


    const {newPassword,confirmPassword}=req.body

    const hashnewPassword=await bcrypt.hash(newPassword,10)
    const hashconfirmPassword=await bcrypt.hash(confirmPassword,10)

    data.newPassword=hashnewPassword;
    data.confirmPassword=hashconfirmPassword
    // console.log(req.gender)
    const finalData=ModelAdmin(data)
    await finalData.save()
    
    
    res.send("Signup Successfully")  }
    catch(err){res.send(err.message)}

})


AuthRouter.post("/loginuser",async (req,res)=>{
    const {emailId,newPassword}=req.body
const checkemail=await ModelUser.findOne({emailId:emailId})
if(!checkemail)
    return res.status(400).send("Email not Found Please Register")
// console.log(checkemail)
const checkpassword= await bcrypt.compare(newPassword,checkemail.newPassword)
if(!checkpassword)
    return res.status(400).send("Password Not Match")
const token =await jwt.sign({_id:checkemail._id},"#raushanaarambh38")
res.cookie("token",token)
const finalemail=await ModelUser.findOne({emailId:emailId}).select("fullName emailId branch collegeName batch photourl age  gender")
return res.send(checkemail)

})

AuthRouter.post("/loginalumini",async (req,res)=>{
    
    const {emailId,newPassword}=req.body
const checkemail=await ModelAlumini.findOne({emailId:emailId})
if(!checkemail)
    return res.status(400).send("No account found with this email. Please register first")
//  if(checkemail.toshow===false)
//     return res.send("email not verified yet")
// console.log(checkemail)
const checkpassword= await bcrypt.compare(newPassword,checkemail.newPassword)
if(!checkpassword)
    return res.status(400).send("Incorrect password. Please try again.")

if(checkemail.toshow===false)
    return res.send("Your account is pending verification by the admin")

// console.log("alumini login")
const token =await jwt.sign({_id:checkemail._id},"#raushanaarambh38")
res.cookie("token",token)

const finalemail=await ModelAlumini.findOne({emailId:emailId}).select("fullName role collegeName batch photourl age company gender emailId about branch")



return res.send(finalemail)

})


AuthRouter.post("/loginadmin",async (req,res)=>{
    const {emailId,newPassword}=req.body
    // console.log(emailId)
const checkemail=await ModelAdmin.findOne({emailId:emailId})
// console.log(checkemail)
if(!checkemail)
    return res.status(400).send("Email not Found Please Ask Admin")
// console.log(checkemail)
const checkpassword= await bcrypt.compare(newPassword,checkemail.newPassword)
if(!checkpassword)
    return res.status(400).send("Password Not Match")
const token =await jwt.sign({_id:checkemail._id},"#raushanaarambh38")
res.cookie("token",token)
const finalemail=await ModelAdmin.findOne({emailId:emailId}).select("fullName role  photourl age  gender  branch emailId")

return res.send(finalemail)

})

AuthRouter.get("/logout",async (req,res)=>{
    res.cookie("token","",{maxAge:0})
    res.send("Logout Successfully")
})
module.exports=AuthRouter