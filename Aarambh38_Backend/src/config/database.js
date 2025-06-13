const mongoose=require("mongoose")

const connectDb=async()=>{
    await mongoose.connect("mongodb+srv://shikhakumari152019:AYD3W9yHCApCNYRz@cluster0.giz65if.mongodb.net/Aarambh38")
}

module.exports=connectDb