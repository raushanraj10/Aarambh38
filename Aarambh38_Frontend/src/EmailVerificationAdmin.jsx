import axios from "axios";
import bcrypt from "bcryptjs";
import { useState, useEffect } from "react";
import {  useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "./constants/AllUrl";
// import { addadmin } from "./utils/AdminSlice";
// import { removealumini } from "./utils/AluminiSlice";
// import { removestudent } from "./utils/StudentSlice";

export default function EmailVerificationAdmin() {
  const [code, setCode] = useState("");
  const location = useLocation();
  const initialMessage = location.state?.message || "";
  const [message, setMessage] = useState(initialMessage);
  const [showMessage, setShowMessage] = useState(!!initialMessage);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const verifydata = useSelector((store) => store.verifyuser);
  // const dispatch =useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isTrue = await bcrypt.compare(code, verifydata.code);
      if (isTrue) {
        setMessage("💼 Welcome Admin! You're now part of the Aarambh38 leadership team.");
        setShowMessage(true);

        const {
          fullName,
          gender,
          emailId,
          age,
          newPassword,
          confirmPassword,
          
        } = verifydata;
        const passkey="Z3rNxTp1VuEyKqW7gMdBL9AfRcJXy842hPn0vUsM"
      //  console.log(gender)
        await axios.post(
  `${BASE_URL}/signupadmin`,
  {
    fullName,
    gender,
    emailId,
    age,
    newPassword,
    confirmPassword,
    passkey
  },
  { withCredentials: true }
);

       
        setTimeout(() => {
           return navigate("/loginselectorpage");
        }, 3000);
      } else {
        setMessage("❌ Invalid verification code.");
        setShowMessage(true);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage("⚠️ Something went wrong during verification.");
      setShowMessage(true);
    }

    setLoading(false);
  };

  // const handleResend = async () => {
  //   const Otp = Math.floor(Math.random() * 900000) + 100000;
  //   const { emailId } = verifydata;

  //   try {
  //     await axios.post(
  //       "http://localhost:5000/sendemail",
  //       { emailId, code: Otp },
  //       { withCredentials: true }
  //     );
  //     const hashedCode = await bcrypt.hash(Otp.toString(), 10);
  //     verifydata.code = hashedCode;
  //     setMessage(`📩 OTP resent to ${emailId}`);
  //     setShowMessage(true);
  //   } catch (err) {
  //     console.error("OTP resend failed", err);
  //     setMessage("❌ Failed to resend OTP.");
  //     setShowMessage(true);
  //   }
  // };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <div className="min-h-screen  bg-blue-300  flex items-center justify-center px-4 relative">
      {/* Floating popup message */}
      {showMessage && (
        <div className="absolute top-6 bg-blue-100 border border-blue-300 text-blue-800 px-6 py-3 rounded-lg shadow-md animate-fade-in-out">
          {message}
        </div>
      )}

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-2">
          Welcome back, Admin! 
        </h2>
        <p className="text-center font-medium text-sm mb-4">
  💼 You're almost there to{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 font-bold">
      Aarambh38
        </span>
      </p> 
        
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to your email to verify and activate your access.
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

        {/* <div className="text-center mt-4">
          <button
            onClick={handleResend}
            className="text-blue-600 text-sm hover:underline"
          >
            Didn’t receive a code? Resend
          </button>
        </div> */}
      </div>
    </div>
  );
}
