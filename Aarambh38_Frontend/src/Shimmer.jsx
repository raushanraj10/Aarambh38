import { removestudent } from "./utils/StudentSlice";
import { removeadmin } from "./utils/AdminSlice";
import { removealumini } from "./utils/AluminiSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function Shimmer() {
  const Dispatch=useDispatch()
    useEffect(()=>{
      Dispatch(removestudent())
      Dispatch(removeadmin())
      Dispatch(removealumini())
    },[])



  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      {/* Animated App Name */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-[length:300%_100%] bg-clip-text text-transparent animate-shimmer tracking-wide mb-4">
        Aarambh38
      </h1>

      {/* Message */}
      <p className="text-base sm:text-lg text-gray-600 font-medium animate-pulse">
        Stay motivated and please wait...
      </p>
    </div>
  );
}
