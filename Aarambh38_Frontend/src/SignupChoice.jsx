import { Link } from "react-router-dom";

export default function SignupChoice() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <div className="bg-white shadow-2xl rounded-2xl px-10 py-12 w-full max-w-xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Create Your Account</h1>
        <p className="text-md text-gray-600 mb-10">
          Choose how you’d like to sign up:
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          {/* Alumni Option */}
          <Link
            to="/signupalumni"
            className="flex-1 bg-blue-50 hover:bg-blue-100 p-6 rounded-xl transition shadow-sm border border-blue-200"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Education%2C_Studying%2C_University%2C_Alumni_-_icon.png/2048px-Education%2C_Studying%2C_University%2C_Alumni_-_icon.png"
              alt="Alumni"
              className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border-2 border-blue-600"
            />
            <p className="text-lg font-semibold text-blue-700">Sign Up as Alumni</p>
          </Link>

          {/* Student Option */}
          <Link
            to="/signupuser"
            className="flex-1 bg-green-50 hover:bg-green-100 p-6 rounded-xl transition shadow-sm border border-green-200"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/354/354637.png"
              alt="Student"
              className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border-2 border-green-600"
            />
            <p className="text-lg font-semibold text-green-700">Sign Up as Student</p>
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
