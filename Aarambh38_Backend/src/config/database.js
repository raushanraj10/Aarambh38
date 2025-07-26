const mongoose=require("mongoose")

const connectDb=async()=>{
    await mongoose.connect("mongodb+srv://namasteyDev:5ODfPUF3kbZJQmGa@cluster0.jcj6rmy.mongodb.net/Aarambh38")
}

module.exports=connectDb


// mongodb+srv://shikhakumari152019:AYD3W9yHCApCNYRz@cluster0.giz65if.mongodb.net/Aarambh38