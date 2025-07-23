import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removestudent } from "./utils/StudentSlice";
import { removeadmin } from "./utils/AdminSlice";
import { removealumini } from "./utils/AluminiSlice";

export default function LoginSelectorPage() {

  const Dispatch=useDispatch()

  useEffect(()=>{
    Dispatch(removestudent())
    Dispatch(removeadmin())
    Dispatch(removealumini())
  },[])



  const navigate = useNavigate();

  const ads = [
    "Connect with alumni mentors across the country.",
    "Get career guidance from experienced professionals.",
    "Unlock exclusive internship and job opportunities.",
    "Empowering students through real alumni stories.",
    "Your journey starts here — with Aarambh38.",
  ];

  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const roles = [
    {
      label: "Admin Login",
      path:"/loginadmin",
      image: "https://cdn-icons-png.flaticon.com/512/1053/1053244.png",
    },
    {
      label: "Alumni Login",
      path: "/loginalumini",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    {
      label: "Student Login",
      path: "/loginuser",
      image: "https://cdn-icons-png.flaticon.com/512/201/201818.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* Left Side: Aarambh38 Branding */}
        <div className="flex flex-col justify-center items-start p-12 space-y-8 bg-gradient-to-br from-indigo-50 via-blue-50 to-green-50">
          <h1 className="text-5xl font-extrabold text-gray-800 leading-snug">
            Welcome to <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight">Aarambh38</span>
          </h1>
          <p className="text-xl text-gray-600 min-h-[60px] transition duration-300 ease-in-out">
            {ads[currentAdIndex]}
          </p>
          <p className="text-base text-gray-500 italic">
            Bridging Students and Alumni with Purpose.
          </p>
        </div>

        {/* Right Side: Login Options */}
        <div className="p-12 flex flex-col justify-center text-center bg-white">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">Login as</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {roles.map(({ label, path, image }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg hover:border-indigo-300 transition duration-300 flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
                  <img src={image} alt={label} className="w-12 h-12 object-contain" />
                </div>
                <span className="text-gray-800 font-semibold text-lg">{label}</span>
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/signupchoice"
              className="text-indigo-600 font-medium hover:underline"
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
