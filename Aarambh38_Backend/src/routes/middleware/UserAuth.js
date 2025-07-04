const jwt =require("jsonwebtoken")
const UserAuth=async (req,res,next)=>{
    try{
    const {token}=req.cookies
    const decode=await jwt.verify(token,"#raushanaarambh38")
    if(!decode)
        res.status(400).send("Not verifed pls login")
     req.decode=decode
    next();
}
    catch(err){res.status(400).send("Error: "+err.message+" please try agian.." )}

}
module.exports=UserAuth