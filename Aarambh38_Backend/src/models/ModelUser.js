const mongoose=require("mongoose")

const UserSchema=new mongoose.Schema({
    fullName:{
        type:String,
        require:true,
    },
    gender:{
        type:String,
        require:true,
        validate(value){
            if(!["male","female","other"].includes(value))
                return res.send("gender not valid")
        }
    },
    collegeName:{
        text:String,
        require:true,
        default:""
    },
    batch:{
        type:Number,
        require:true,
        default:2022
    },
    age:{
        text:Number,
        require:true,
    },
    registration:{
        text:Number,
        require:true,
    },
    emailId:{
        text:String,
        require:true,
    },
    newPassword:{
        text:String,
        require:true,
    },
    confirmpassword:{
        text,String,
        require:true,
    },
    photourl:{
        text:String,
        default:""
    },
    mobilenumber:{
        text:Number
    }
},{timestamps:true})


const ModelUser=mongoose.model("ModelUser",UserSchema)

module.exports=ModelUser