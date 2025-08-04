const mongoose = require("mongoose");
const validator = require("validator");

const OtpSchema = new mongoose.Schema({
  emailId: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Invalid email format"],
  },
  code: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // 600 seconds = 10 minutes
  },
});

const ModelOtp = mongoose.model("ModelOtp", OtpSchema);

module.exports = ModelOtp;
