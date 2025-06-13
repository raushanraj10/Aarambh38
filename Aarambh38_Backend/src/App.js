const express=require("express")
const app=express();


app.get("/",(req,res)=>{
    res.send("This is the homepage")
})

app.listen(5000,()=>{
    console.log("App is listening on 5000")
})