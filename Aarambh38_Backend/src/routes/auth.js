const express =require("express");
const ModelUser = require("../models/ModelUser");
const validate =require("validator");
const validateBodyData = require("../utils/ValidateBodyData");
const SendEmail =require("../utils/SendEmail");
const ModelAlumini = require("../models/ModelAlumini");

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
    
    const finalData=ModelAlumini(data)
    await finalData.save()
    
    res.send("Signup Successfully")
    

})

AuthRouter.post("/login",async (req,res)=>{
    const {emailId,Password}=req.body
const checkemail=await ModelUser.findOne({emailId:emailId})

const checkpassword= await bcrypt.compare(Password,checkemail.newPassword)

})



module.exports=AuthRouter