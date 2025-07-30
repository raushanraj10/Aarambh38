const mongoose=require("mongoose")
const validator=require("validator")
const AluminiSchema=new mongoose.Schema({
    // "fullName gender toshow collegeName branch role company batch age photourl about mobileNumber registration "
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
    collegeName:{
        type:String,
        require:true,
        default:"Bakhtiyarpur College Of Engineering"
    },
    branch:{
        type:String,
        require:true
    },
    
    role:{
        type:String,
        require:true,
        default:"Manager"
    },
    
    company:{
        type:String,
        require:true,
        default:"Google"
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
        minLength:11,
        require:true,
    },
    emailId:{
        type:String,
        require:true,
    },
    newPassword:{
        type:String,
        require:true,
        minLength:6,
    },
    confirmPassword:{
        type:String,
        require:true,
        minLength:6,
    },
    photourl:{
        type:String,
        default:"https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?semt=ais_items_boosted&w=740"
    },
    about:{
        type:String
    },
    mobileNumber:{
        type:Number
    },
    toshow:{
        type:Boolean,
        require:true,
        default:false
    }
},{timestamps:true})


const ModelAlumini=mongoose.model("ModelAlumini",AluminiSchema)

module.exports=ModelAlumini