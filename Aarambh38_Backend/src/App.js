const express=require("express")
const app=express();
const AuthRouter =require("./routes/auth")
const connectDb=require("./config/database")

app.use(express.json())
// this convert data into json to js for understand js console

app.use("/",AuthRouter)
// app.get("/",(req,res)=>{
//     console.log(req.body)
//     res.send("This is the homepage")
// })


connectDb().then(()=>{app.listen(5000,()=>{
    console.log("Database connected successfully")
    console.log("App is listening on 5000")
})})
.catch(()=>{console.log("Error: Not available to connect to ur database")})
