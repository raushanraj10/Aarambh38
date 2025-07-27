const mongoose=require("mongoose")
const validator=require("validator")
const UserSchema=new mongoose.Schema({
    fullName:{
        type:String,
        require:true,
    },
    gender:{
        type:String,
        require:true,
        
        // validate(value){
        //     console.log(value)
        //     if(!["male","female","other"].includes(value))
        //         return res.status(400).send("gender not valid")
        // }
    },
    branch:{
      type:String,
      require:true
    },
    collegeName:{
        type:String,
        // require:true,
        default:"Bakhtiyarpur College Of Engineering"
    },
    batch:{
        type:Number,
        // require:true,
        default:2022
    },
    age:{
        type:Number,
        // require:true,
    },
    registration:{
        type:Number,
        require:true,
        minLength:11
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
    photourl:{
        type:String,
        default:"https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?semt=ais_items_boosted&w=740"
    },
    mobileNumber:{
        type:Number
    }
},{timestamps:true})


const ModelUser=mongoose.model("ModelUser",UserSchema)

module.exports=ModelUser