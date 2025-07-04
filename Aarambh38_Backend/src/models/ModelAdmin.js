const mongoose=require("mongoose")
const validator=require("validator")
const AdminSchema=new mongoose.Schema({
    fullName:{
        type:String,
        require:true,
    },
    emailId:{
        type:String,
        require:true,
    },
    newPassword:{
        type:String,
        require:true,
        // min:4,
    },
    confirmPassword:{
        type:String,
        require:true,
        // minLength:4,
    },
    age:{
        type:Number,
        require:true,
        // minLength:4,
    },
    mobileNumber:{
        type:Number
    }

},{timestamps:true})


const ModelAdmin=mongoose.model("ModelAdmin",AdminSchema)

module.exports=ModelAdmin