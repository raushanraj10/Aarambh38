const express =require("express");
const ModelUser = require("../models/ModelUser");
const validate =require("validator");
const validateBodyData = require("../utils/ValidateBodyData");

const AuthRouter=express.Router()

AuthRouter.post("/signup",async (req,res)=>{
    const data=req.body;
    // console.log(data)
    const requiredFields=["fullName","gender","emailId","newPassword","confirmPassword","registration"]
    
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
    
    res.send("form signup")
    

})
module.exports=AuthRouter