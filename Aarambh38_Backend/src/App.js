const express=require("express")
const cookieparser =require("cookie-parser")
const app=express();


const connectDb=require("./config/database")
const cors =require("cors")
app.use(cookieparser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use(express.json())

// app.options("*", cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));


// this convert data into json to js for understand js console
const AuthRouter =require("./routes/auth");
const ProfileRouter = require("./routes/Profile");

app.use("/",AuthRouter)
app.use("/",ProfileRouter)
// app.get("/",(req,res)=>{
//     console.log(req.body)
//     res.send("This is the homepage")
// })


connectDb().then(()=>{app.listen(5000,()=>{
    console.log("Database connected successfully")
    console.log("App is listening on 5000")
})})
.catch(()=>{console.log("Error: Not available to connect to ur database")})
