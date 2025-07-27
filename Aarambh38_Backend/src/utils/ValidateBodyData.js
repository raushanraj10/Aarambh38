const validate=require("validator")
const BranchList=require("../constants/BranchList")
const governmentEngineeringColleges=require("../constants/CollegeList38")
const validateBodyData=(req,res)=>{
    // console.log(BranchList)
    const {emailId,gender,age,newPassword,branch,collegeName}=req.body
    if(!validate.isEmail(emailId))
            return res.status(400).send("Email not vaid")
    if(!["Male","Female","Other"].includes(gender))
        return res.status(400).send("gender not valid")
    if(age<0)
        return res.status(400).send("Age not vaid")
    if(!governmentEngineeringColleges.includes(collegeName))
    { 
        return res.status(400).send("College not valid")}
    if(!BranchList.includes(branch))
        return res.status(400).send("Branch not found")
    
    if(newPassword.length<=3)
        return res.status(400).send("Password must be at least 3 characters long")
 
}
module.exports=validateBodyData