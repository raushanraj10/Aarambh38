const mongoose=require("mongoose")


const AlumniConnectionSchema=mongoose.Schema({
    fromuserId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    touserId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
    },
    status:{
        type:String,
        require:true,
        enum:{
           values:["blocked","unblocked","accepted","rejected"],
           message:`{VALUE} valued not define`
        }
    }
},{timestamps:true})

const ModelAlumniConnection=mongoose.model("ModelAlumniConnection",AlumniConnectionSchema)

module.exports=ModelAlumniConnection