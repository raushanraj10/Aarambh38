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

const AuthRouter=express.Router()

AuthRouter.post("/sendemail",async (req,res)=>{
    try{
    const {emailId,code}=req.body
    await SendEmail(emailId,code)
    res.send("Email Sent")
}
    catch(err){console.log(err.message)}
})

AuthRouter.post("/signupuser",async (req,res)=>{
        if(!req.body.passkey|| req.body.passkey!=="B8mYx72dKJrQWpLcEVANztf1hoG53uOXRMkC9Sig")
        return res.status(400).send("First verify Email")
    const data=req.body;
    // console.log(data)
    const requiredFields=["fullName","gender","emailId","newPassword","confirmPassword","registration","age","collegeName","branch","passkey","photourl"]
    
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

    if(req.body.newPassword!==req.body.confirmPassword)
        return res.status(400).send("Password not match")

    const {newPassword,confirmPassword}=req.body



    const hashnewPassword=await bcrypt.hash(newPassword,10)
    const hashconfirmPassword=await bcrypt.hash(confirmPassword,10)

    data.newPassword=hashnewPassword;
    data.confirmPassword=hashconfirmPassword


    
    const finalData=ModelUser(data)
    await finalData.save()
    
    res.send("Signup Successfully")
    

})

AuthRouter.post("/signupalumini",async (req,res)=>{
    if(!req.body.passkey || req.body.passkey!=="U7fK93pLzQeRmXY4tWcVB28GdhJkAo1ZxN56rMuE")
     return res.status(400).send("First verify Email")
    const data=req.body;
    // console.log(data)
    const requiredFields=["fullName","gender","emailId","newPassword","confirmPassword","registration","batch","collegeName","company","role","photourl","about","passkey","branch"]
    
     const allFieldsPresent = requiredFields.every(field => field in data);

    if (!allFieldsPresent) {
        const missingFields = requiredFields.filter(field => !(field in data));
        return res.status(400).send("Missing fields: " + missingFields.join(", "));
    }
    // .include not working because data is object and requiredfields are array use "in" keyword
    const data1=validateBodyData(req,res);
    if(data1)
        return;

    const checkemailid=await ModelAlumini.findOne({emailId:req.body.emailId})
    if(checkemailid)
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
    if(!req.body.passkey || req.body.passkey!=="Z3rNxTp1VuEyKqW7gMdBL9AfRcJXy842hPn0vUsM")
     return res.status(400).send("First verify Email")

    const data=req.body;
    // console.log(data)
    const requiredFields=["fullName","gender","emailId","newPassword","confirmPassword","age","photourl"]
    
     const allFieldsPresent = requiredFields.every(field => field in data);

    if (!allFieldsPresent) {
        const missingFields = requiredFields.filter(field => !(field in data));
        return res.status(400).send("Missing fields: " + missingFields.join(", "));
    }
    // .include not working because data is object and requiredfields are array use "in" keyword
    // validateBodyData(req,res);

    const checkemailid=await ModelAdmin.findOne({emailId:req.body.emailId})
    if(checkemailid)
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
    
    
    res.send("Signup Successfully")  

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


// console.log(checkpassword)

return res.send(checkemail)

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

return res.send(checkemail)

})

AuthRouter.get("/logout",async (req,res)=>{
    res.cookie("token","",{maxAge:0})
    res.send("Logout Successfully")
})


module.exports=AuthRouter