import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight">
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

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Link
            to="/login"
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
        </div>
      </div>
    </nav>
  );
}

