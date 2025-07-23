import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { removestudent } from "./utils/StudentSlice";
import { removealumini } from "./utils/AluminiSlice";
import { removeadmin } from "./utils/AdminSlice";
import axios from "axios";
import { Verifieduser } from "./utils/EmailSlice";
import {BASE_URL} from "../src/constants/AllUrl"

export default function Navbar() {
  const dispatch = useDispatch();
  const Studentdata = useSelector((store) => store.studentdata);
  const Alumnidata = useSelector((store) => store.aluminidata);
  const Admindata = useSelector((store) => store.admindata);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    await axios.get(`${BASE_URL}/logout`, { withCredentials: true });
    dispatch(Verifieduser());
    dispatch(removestudent());
    dispatch(removealumini());
    dispatch(removeadmin());
  };

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

  const renderLinks = (isMobile = false) => {
    const linkClass = isMobile ? "text-gray-700" : "text-gray-700 hover:text-blue-600";
    const wrapClass = isMobile ? "flex flex-col space-y-3" : "hidden md:flex space-x-6 items-center";

    if (!Studentdata && !Alumnidata && !Admindata) {
      return (
        <div className={wrapClass}>
          <Link to="/" onClick={closeMenu} className={linkClass}>Home</Link>
          <Link to="/about" onClick={closeMenu} className={linkClass}>About</Link>
          <Link to="/loginselectorpage" onClick={closeMenu} className={`${linkClass} border border-blue-600 px-4 py-1 rounded hover:bg-blue-50`}>
            Login
          </Link>
          <Link to="/signupchoice" onClick={closeMenu} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-center">
            Sign Up
          </Link>
        </div>
      );
    }

    // 👇 Role-based dashboard links
    let dashboardLink = { to: "/landingpage", label: "Dashboard" };
    if (Alumnidata) {
      dashboardLink = { to: "/alumnirecievedrequest", label: "Received Requests" };
    } else if (Admindata) {
      dashboardLink = { to: "#", label: "All Students" };
    }

    const baseLinks = [
      {
        to:
          Studentdata ? "/editprofileuser" :
          Alumnidata ? "/editprofilealumni" :
          "/editprofileadmin",
        label: "Profile",
      },
      dashboardLink,
    ];

    const roleLinks = Studentdata
  ? [{ to: "/mymentors", label: "My Mentors" }]
  : Alumnidata
  ? [
      { to: "/alumnimentees", label: "My Mentees" },
      { to: "/alumniblocked", label: "Blacklisted Students" }, // ✅ New route
    ]
  : [{ to: "#", label: "All Alumni" }];


    const logoutButton = (
      <button
        onClick={() => {
          handleLogout();
          closeMenu();
        }}
        className="text-red-600 hover:text-red-800 flex items-center"
      >
        <LogOut size={16} className="mr-1" />
        Logout
      </button>
    );

    return (
      <div className={wrapClass}>
        {[...baseLinks, ...roleLinks].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={closeMenu}
            className={linkClass}
          >
            {item.label}
          </Link>
        ))}
        {logoutButton}
      </div>
    );
  };

  return (
    <nav className="bg-white border-b shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="#"
          className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600"
        >
          Aarambh38
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700"
        >
          <Menu size={28} />
        </button>

        {/* Desktop */}
        {renderLinks(false)}
      </div>

      {/* Mobile Dropdown */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out bg-white px-4 ${
          menuOpen ? "max-h-96 py-4" : "max-h-0"
        }`}
      >
        {renderLinks(true)}
      </div>
    </nav>
  );
}
