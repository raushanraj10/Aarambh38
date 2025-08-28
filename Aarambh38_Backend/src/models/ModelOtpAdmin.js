const mongoose = require("mongoose");
const validator = require("validator");

const OtpAdminSchema = new mongoose.Schema({
  emailId: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Invalid email format"],
  },
  code: {
    type: Number,
    required: true,
  },
  
  
  fullName:{
    type:String,
    require:true
  },
   createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // ⏳ auto-delete after 600 seconds (10 minutes)
  },
});

const ModelOtpAdmin = mongoose.model("ModelOtpAdmin", OtpAdminSchema);

module.exports = ModelOtpAdmin;
