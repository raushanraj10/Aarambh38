import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { removestudent } from "./utils/StudentSlice";
import { removealumini } from "./utils/AluminiSlice";
import { removeadmin } from "./utils/AdminSlice";
import axios from "axios";
import { Verifieduser } from "./utils/EmailSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const Studentdata = useSelector((store) => store.studentdata);
  const Alumnidata = useSelector((store) => store.aluminidata);
  const Admindata = useSelector((store) => store.admindata);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isLoggedIn = Studentdata || Alumnidata || Admindata;

  const handleLogout = async () => {
    await axios.get("http://localhost:5000/logout", { withCredentials: true });
    dispatch(Verifieduser());
    dispatch(removestudent());
    dispatch(removealumini());
    dispatch(removeadmin());
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white border-b shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600"
        >
          Aarambh38
        </Link>

        {/* Hamburger icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700"
        >
          <Menu size={28} />
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {!isLoggedIn ? (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link to="/alumni" className="text-gray-700 hover:text-blue-600">About</Link>
              {/* <Link to="/students" className="text-gray-700 hover:text-blue-600">Contact</Link> */}
              <Link to="/loginselectorpage" className="border border-blue-600 text-blue-600 px-4 py-1 rounded hover:bg-blue-50">Login</Link>
              <Link to="/signupchoice" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Sign Up</Link>
            </>
          ) : (
            <>
              
              <Link to={
                Studentdata ? "/editprofileuser" :
                Alumnidata ? "/editprofilealumni" :
                "/editprofileadmin"
              } className="text-gray-700 hover:text-blue-600">Profile</Link>
              <Link to="/landingpage" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <button onClick={handleLogout} className="text-red-600 hover:text-red-800 flex items-center">
                <LogOut size={16} className="mr-1" /> Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out bg-white px-4 ${
          menuOpen ? "max-h-96 py-4" : "max-h-0"
        }`}
      >
        {!isLoggedIn ? (
          <div className="flex flex-col space-y-3">
            <Link to="/" onClick={closeMenu} className="text-gray-700">Home</Link>
            <Link to="/alumni" onClick={closeMenu} className="text-gray-700">About</Link>
           <Link to="/landingpage" onClick={closeMenu} className="text-gray-700">Dashboard</Link>
            <Link to="/loginselectorpage" onClick={closeMenu} className="text-blue-600 border border-blue-600 rounded px-4 py-1 text-center">Login</Link>
            <Link to="/signupchoice" onClick={closeMenu} className="bg-blue-600 text-white rounded px-4 py-1 text-center">Sign Up</Link>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            
            <Link
              to={
                Studentdata ? "/editprofileuser" :
                Alumnidata ? "/editprofilealumni" :
                "/editprofileadmin"
              }
              onClick={closeMenu}
              className="text-gray-700"
            >
              Profile
            </Link>
            <Link to="/landingpage" onClick={closeMenu} className="text-gray-700">Dashboard</Link>
            <button
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
              className="text-red-600 flex items-center"
            >
              <LogOut size={16} className="mr-1" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
