import { Link } from "react-router-dom";
import { removestudent } from "./utils/StudentSlice";
import { removeadmin } from "./utils/AdminSlice";
import { removealumini } from "./utils/AluminiSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


export default function SignupChoice() {
  const Dispatch=useDispatch()
      useEffect(()=>{
        Dispatch(removestudent())
        Dispatch(removeadmin())
        Dispatch(removealumini())
      },[])


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 flex items-center justify-center px-4 py-10 overflow-hidden">
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0" />

      {/* Main content */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl px-10 py-14 w-full max-w-6xl text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-800 mb-4">
          Join <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight">Aarambh38</span>
        </h1>
        <p className="text-lg text-gray-700 mb-10">
          Build your future by connecting students, alumni, and mentors in one platform.
        </p>

        {/* Why Join Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
          <div className="bg-white shadow-lg rounded-xl p-5 border-t-4 border-blue-500">
            <h3 className="text-blue-700 font-bold text-lg mb-2">🌐 Alumni Network</h3>
            <p className="text-gray-600 text-sm">Connect with successful alumni from your institution to get mentorship and career guidance.</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-5 border-t-4 border-green-500">
            <h3 className="text-green-700 font-bold text-lg mb-2">🚀 Career Boost</h3>
            <p className="text-gray-600 text-sm">Discover opportunities, internships, and real-world advice directly from professionals.</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-5 border-t-4 border-purple-500">
            <h3 className="text-purple-700 font-bold text-lg mb-2">🤝 Community</h3>
            <p className="text-gray-600 text-sm">Be part of an active, supportive community that grows together academically and professionally.</p>
          </div>
        </div>

        {/* Signup Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Link
            to="/signupalumini"
            className="flex flex-col items-center bg-white hover:bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Education%2C_Studying%2C_University%2C_Alumni_-_icon.png/2048px-Education%2C_Studying%2C_University%2C_Alumni_-_icon.png"
              alt="Alumni"
              className="w-20 h-20 mb-4 object-contain"
            />
            <p className="text-lg font-semibold text-blue-700">Sign Up as Alumni</p>
          </Link>

          <Link
            to="/signupuser"
            className="flex flex-col items-center bg-white hover:bg-green-50 border border-green-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/354/354637.png"
              alt="Student"
              className="w-20 h-20 mb-4 object-contain"
            />
            <p className="text-lg font-semibold text-green-700">Sign Up as Student</p>
          </Link>

          <Link
            to="/signupadmin"
            className="flex flex-col items-center bg-white hover:bg-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Admin"
              className="w-20 h-20 mb-4 object-contain"
            />
            <p className="text-lg font-semibold text-yellow-600">Sign Up as Admin</p>
          </Link>
        </div>

        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/loginselectorpage" className="text-blue-600 font-medium hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
