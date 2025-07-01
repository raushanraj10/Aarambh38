import { Link } from "react-router-dom";

export default function SignupChoice() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-green-50 px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl px-8 py-12 w-full max-w-4xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">Create Your Account</h1>
        <p className="text-md text-gray-600 mb-10">
          Choose how you’d like to sign up:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Alumni Option */}
          <Link
            to="/signupalumni"
            className="flex flex-col items-center justify-between bg-white hover:bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-md hover:shadow-lg transition min-h-[260px]"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Education%2C_Studying%2C_University%2C_Alumni_-_icon.png/2048px-Education%2C_Studying%2C_University%2C_Alumni_-_icon.png"
              alt="Alumni"
              className="w-20 h-20 rounded-full border-2 border-blue-500 mb-4 object-cover"
            />
            <p className="text-lg font-semibold text-blue-700">Sign Up as Alumni</p>
          </Link>

          {/* Student Option */}
          <Link
            to="/signupuser"
            className="flex flex-col items-center justify-between bg-white hover:bg-green-50 border border-green-200 rounded-xl p-6 shadow-md hover:shadow-lg transition min-h-[260px]"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/354/354637.png"
              alt="Student"
              className="w-20 h-20 rounded-full border-2 border-green-500 mb-4 object-cover"
            />
            <p className="text-lg font-semibold text-green-700">Sign Up as Student</p>
          </Link>

          {/* Admin Option */}
          <Link
            to="/signupadmin"
            className="flex flex-col items-center justify-between bg-white hover:bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-md hover:shadow-lg transition min-h-[260px]"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Admin"
              className="w-20 h-20 rounded-full border-2 border-yellow-500 mb-4 object-cover"
            />
            <p className="text-lg font-semibold text-yellow-600">Sign Up as Admin</p>
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-10">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
