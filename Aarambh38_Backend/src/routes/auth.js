const express =require("express");
const ModelUser = require("../models/ModelUser");
const validate =require("validator");
const validateBodyData = require("../utils/ValidateBodyData");
const SendEmail =require("../utils/SendEmail");
const ModelAlumini = require("../models/ModelAlumini");
const bcrypt =require("bcrypt")

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
    const data=req.body;
    // console.log(data)
    const requiredFields=["fullName","gender","emailId","newPassword","confirmPassword","registration","age","collegeName"]
    
     const allFieldsPresent = requiredFields.every(field => field in data);

    if (!allFieldsPresent) {
        const missingFields = requiredFields.filter(field => !(field in data));
        return res.status(400).send("Missing fields: " + missingFields.join(", "));
    }
    // .include not working because data is object and requiredfields are array use "in" keyword
    validateBodyData(req,res);

    // const checkemailid=await ModelUser.findOne({emailId:req.body.emailId})
    // if(checkemailid)
    //     return res.status(400).send("Email already exist")

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
    const data=req.body;
    // console.log(data)
    const requiredFields=["fullName","gender","emailId","newPassword","confirmPassword","registration","batch","collegeName","company","role","photourl","about"]
    
     const allFieldsPresent = requiredFields.every(field => field in data);

    if (!allFieldsPresent) {
        const missingFields = requiredFields.filter(field => !(field in data));
        return res.status(400).send("Missing fields: " + missingFields.join(", "));
    }
    // .include not working because data is object and requiredfields are array use "in" keyword
    validateBodyData(req,res);

    // const checkemailid=await ModelUser.findOne({emailId:req.body.emailId})
    // if(checkemailid)
    //     return res.status(400).send("Email already exist")

    if(req.body.newPassword!==req.body.confirmPassword)
        return res.status(400).send("Password not match")


    const {newPassword,confirmPassword}=req.body

    const hashnewPassword=await bcrypt.hash(newPassword,10)
    const hashconfirmPassword=await bcrypt.hash(confirmPassword,10)

    data.newPassword=hashnewPassword;
    data.confirmPassword=hashconfirmPassword
    
    const finalData=ModelAlumini(data)
    await finalData.save()
    
    res.send("Signup Successfully")
    

})

AuthRouter.post("/loginuser",async (req,res)=>{
    const {emailId,newPassword}=req.body
const checkemail=await ModelUser.findOne({emailId:emailId})
if(!checkemail)
    return res.status(400).send("Email not Found Please Register")
console.log(checkemail)
const checkpassword= await bcrypt.compare(newPassword,checkemail.newPassword)
if(!checkpassword)
    return res.status(400).send("Password Not Match")

return res.send(checkemail)

})

AuthRouter.post("/loginalumini",async (req,res)=>{
    const {emailId,newPassword}=req.body
const checkemail=await ModelAlumini.findOne({emailId:emailId})
if(!checkemail)
    return res.status(400).send("Email not Found Please Register")
// console.log(checkemail)
const checkpassword= await bcrypt.compare(newPassword,checkemail.newPassword)
if(!checkpassword)
    return res.status(400).send("Password Not Match")
console.log(checkpassword)

return res.send(checkemail)

})


AuthRouter.post("/loginadmin",async (req,res)=>{
    const {emailId,newPassword}=req.body
const checkemail=await ModelUser.findOne({emailId:emailId})
if(!checkemail)
    return res.status(400).send("Email not Found Please Register")
console.log(checkemail)
const checkpassword= await bcrypt.compare(newPassword,checkemail.newPassword)
if(!checkpassword)
    return res.status(400).send("Password Not Match")

return res.send(checkemail)

})


module.exports=AuthRouter