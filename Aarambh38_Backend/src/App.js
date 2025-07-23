const express=require("express")
const cookieparser =require("cookie-parser")
const app=express();
const http=require("http")
const IntializeSocket=require("./utils/IntializeSocket")
const BASE_URL =require("./constants/ALLURL")


const connectDb=require("./config/database")
const cors =require("cors")
app.use(cookieparser())
app.use(cors({
  origin: BASE_URL,
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
const UserRouter = require("./routes/UserWantConnection");
const AlumniRouter=require("./routes/AlumniConnection");
// const BASE_URL = require("./constants/ALLURL");


app.use("/",AuthRouter)
app.use("/",ProfileRouter)
app.use("/",UserRouter)
app.use("/",AlumniRouter)
// app.get("/",(req,res)=>{
//     console.log(req.body)
//     res.send("This is the homepage")
// })
const server=http.createServer(app);
IntializeSocket(server);


connectDb().then(()=>{server.listen(5000,()=>{
    console.log("Database connected successfully")
    console.log("App is listening on 5000")
})})
.catch(()=>{console.log("Error: Not available to connect to ur database")})
