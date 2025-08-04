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
  }
});

const ModelOtpAdmin = mongoose.model("ModelOtpAdmin", OtpAdminSchema);

module.exports = ModelOtpAdmin;
