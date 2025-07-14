const mongoose=require("mongoose")
const ModelAlumini = require("./ModelAlumini")
const ModelUser = require("./ModelUser")


const UserSendConnectionSchema=mongoose.Schema({
    fromuserId:{
        type:mongoose.Schema.Types.ObjectId,
        // ref:ModelAlumini,
        ref:ModelUser,
        require:true
    },
    touserId:{
        type:mongoose.Schema.Types.ObjectId,
        // ref:ModelAlumini,
        ref:ModelUser,
        require:true,
    },
    text:{
        type:String
    },  
    status:{
        type:String,
        require:true,
        
    
        enum:{
           values:["sended","blocked","unblocked","accepted","rejected","message"],
           message:`{VALUE} valued not define`
        }
    }
},{timestamps:true})

const ModelUserSendConnection=mongoose.model("ModelUserSendConnection",UserSendConnectionSchema)

module.exports=ModelUserSendConnection