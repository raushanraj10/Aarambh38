const validate=require("validator")
const validateBodyData=(req,res)=>{
    const {emailId,gender,age,newPassword}=req.body
    if(!validate.isEmail(emailId))
            return res.status(400).send("Email not vaid")
    if(!["Male","Female","Other"].includes(gender))
        return res.status(400).send("gender not valid")
    if(age<0)
        return res.status(400).send("Age not vaid")
    
    if(newPassword.length<=3)
        return res.status(400).send("Password must be at least 3 characters long")

}
module.exports=validateBodyData