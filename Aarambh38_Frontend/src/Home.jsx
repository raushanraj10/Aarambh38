import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeadmin } from "./utils/AdminSlice";
import { removealumini } from "./utils/AluminiSlice";
import { removestudent } from "./utils/StudentSlice";

export default function Home() {
  const dispatch=useDispatch()
  useEffect(()=>{
        dispatch(removeadmin())
        dispatch(removealumini())
        dispatch(removestudent())
  },[])
  const headings = [
  "Welcome to Aarambh38",
  "Connect Alumni and Students",
  "Grow Together with Mentorship",
  "Build Your Professional Network",
  "Easily Ask for Referrals from Alumni",
  "Explore Alumni Career Journeys",
  "Get Personalized Guidance Anytime",
  "Stay Motivated with Real Success Stories",
  "Unlock Opportunities Through Connections",
  "Learn, Connect, and Level Up Together",
  "Ask Which Path is Right for Your Career Goal",
  "Get Clarity on Your Dream Career from Alumni",
  "Understand What It Takes to Achieve Your Aim",
  "Plan Your Future with Alumni Who've Been There",
  "Make Smarter Choices with Real-World Insights"
]


  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % headings.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const alumniList = [
    {
      id: 1,
      name: "Ravi Kumar",
      batch: "2018",
      company: "Google",
      position: "Software Engineer",
      photo: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: 2,
      name: "Priya Sharma",
      batch: "2019",
      company: "Amazon",
      position: "Product Manager",
      photo: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: 3,
      name: "Aman Verma",
      batch: "2020",
      company: "Microsoft",
      position: "Data Scientist",
      photo: "https://i.pravatar.cc/150?img=7",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-green-500 transition-all duration-700 ease-in-out mb-4">
          {headings[index]}
        </h1>
        <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto">
          A modern platform to connect students with successful alumni for mentorship, networking, and career growth.
        </p>
        <Link
          to="/signupchoice"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Join the Network
        </Link>
      </section>

      {/* Why Us Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Why Aarambh38?</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Mentorship</h3>
              <p className="text-gray-600">Get career guidance directly from experienced alumni in your field.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-green-600 mb-2">Networking</h3>
              <p className="text-gray-600">Build real professional connections that help you grow beyond college.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-purple-600 mb-2">Opportunities</h3>
              <p className="text-gray-600">Discover internships, referrals, and job opportunities from alumni.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Showcase Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Meet Our Alumni</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {alumniList.map((alumni) => (
              <div
                key={alumni.id}
                className="bg-gray-50 rounded-xl p-6 text-center shadow hover:shadow-lg transition"
              >
                <img
                  src={alumni.photo}
                  alt={alumni.name}
                  className="w-24 h-24 mx-auto rounded-full mb-4 border-2 border-blue-500 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-800">{alumni.name}</h3>
                <p className="text-sm text-gray-500">Batch {alumni.batch}</p>
                <p className="text-sm text-gray-600">{alumni.position} @ {alumni.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className=" py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">1. Sign Up</h3>
              <p className="text-gray-600">Choose your role – Alumni or Student – and create your profile.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-600 mb-2">2. Connect</h3>
              <p className="text-gray-600">Search, follow, and interact with alumni/students in your domain.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-purple-600 mb-2">3. Grow</h3>
              <p className="text-gray-600">Access shared resources, career help, and exclusive opportunities.</p>
            </div>
          </div>
        </div>
      </section>

    <section className=" py-10 px-4">
  <div className="max-w-3xl mx-auto text-center border border-gray-200 bg-white rounded-xl shadow-sm py-8 px-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">
      Ready to Start Your Journey?
    </h2>
    <p className="text-sm text-gray-600 mb-5">
      Connect with mentors, explore opportunities, and grow with Aarambh38.
    </p>
    <Link
      to="/signupchoice"
      className="inline-block bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Create Your Account
    </Link>
  </div>
</section>



    </div>
  );
}
