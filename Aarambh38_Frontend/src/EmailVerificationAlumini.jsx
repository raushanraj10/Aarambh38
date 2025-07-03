import axios from "axios";
import bcrypt from "bcryptjs";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SignupPageUser from "./SignupPageUser";


export default function EmailVerificationAlumini() {
  
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const Navigate=useNavigate();
  const verifydata=useSelector((store)=>store.verifyuser)
//    console.log(verifydata.code)
  

   const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent the form from reloading the page
  setLoading(true);
  try {
    const isTrue = await bcrypt.compare(code, verifydata.code);
    if (isTrue) {
      setMessage("✅ Email verified successfully!");
      
      const {fullName,gender,emailId,registration,newPassword,confirmPassword,collegeName,role,company,batch,photourl,about}=verifydata
// console.log(gender)
    const res=await axios.post("http://localhost:5000/signupalumini",{photourl,about,fullName,gender,emailId,registration,newPassword,confirmPassword,batch,collegeName,company,role},{withCredentials:true})
     console.log(res)
      return Navigate("/landingpage")
    } else {
      setMessage("❌ Invalid verification code.");
    }
  } catch (error) {
    console.error("Verification error:", error);
    setMessage("⚠️ Something went wrong during verification.");
  }
  setLoading(false);
};


  

  const handleResend = async () => {
    SignupPageUser.handleSubmit
    console.log("Setting message...");
    setMessage("📩 OTP resent successfully!");


    // const {emailId}=verifydata
    // console.log(emailId)
    console.log(Otp)

  // const res=await axios.post("http://localhost:5000/sendemail",{emailId,Otp},{withCredentials:true})
  // console.log(res)
  // Generate a 6-digit random code
  
  // const hashcode=  bcrypt.hash(code,10)

  // Update form data with the code
  
  // const hashedCode = await bcrypt.hash(Otp.toString(), 10);
  

  // Update state
  // verifydata.code=hashedCode;
  

  // setMessage("Otp resend successfully")
  // Dispatch to Redux
  

  // Optional: for debugging
  // console.log("Verification Code:", code);
  
  // return Navigate("/emailverification")
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to your email to complete verification.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter code"
            required
          />

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={handleResend}
            className="text-blue-600 text-sm hover:underline"
          >
            Didn’t receive a code? Resend
          </button>
        </div>

        {message && (
          <div className="mt-4 text-center text-sm text-gray-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
