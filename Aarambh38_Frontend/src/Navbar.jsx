import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const user = useSelector((store) => store.auth?.user); // adjust as per your state
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch({ type: "auth/logout" }); // update with your actual logout action
    navigate("/loginselectorpage");
  };

  return (
    <nav className="bg-white shadow-md z-50 relative">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight"
        >
          Aarambh38
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </Link>
          <Link to="/alumni" className="text-gray-700 hover:text-blue-600 font-medium">
            About
          </Link>
          <Link to="/students" className="text-gray-700 hover:text-blue-600 font-medium">
            Contact
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3 relative">
          {!user ? (
            <>
              <Link
                to="/loginselectorpage"
                className="px-4 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition"
              >
                Login
              </Link>
              <Link
                to="/signupchoice"
                className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* User Avatar */}
              <div className="relative">
                <img
                  src={user.photourl || "https://i.pravatar.cc/40"} // fallback photo
                  alt="User"
                  className="w-10 h-10 rounded-full border cursor-pointer"
                  onClick={() => setMenuOpen(!menuOpen)}
                />

                {/* Dropdown menu */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
