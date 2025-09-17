import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const Studentdata = useSelector((store) => store.studentdata);
  const Aluminidata = useSelector((store) => store.aluminidata);
  const headings = [
  "Welcome to संyukt38",
  "Connect Alumni and Students",
  "Grow Together with Mentorship",
  "Build Your Professional Network",
  "Easily Ask for Referrals from Alumni",
  "Explore Alumni Career Journeys",
  "Stay Motivated with Real Success Stories",
  "Unlock Opportunities Through Connections",
  "Ask Which Path is Right for Your Career Goal",
  "Plan Your Future with Alumni Who've Been There",
  "Alumni Can Privately Help Students Without Sharing Personal Info",
   "Only Verified Alumni Are Shown in the Student Dashboard",
   "Get Guidance from GATE Qualified Alumni for Your Preparation"
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

  const testimonials = [
    {
      id: 1,
      name: "Ankit Sharma",
      company: "Amazon",
      photo: "https://i.pravatar.cc/150?img=1",
      message: "संyukt38 helped me connect with amazing alumni who guided me through my placement preparation. I got my dream job at TCS thanks to their mentorship!",
    },
    {
      id: 2,
      name: "Sneha Gupta",
      company: "Amazon",
      photo: "https://i.pravatar.cc/150?img=9",
      message: "Being part of संyुkt38 as an alumni has been incredibly rewarding. I love helping juniors navigate their career paths and seeing them succeed.",
    },
    {
      id: 3,
      name: "Rahul Mishra",
      company: "Amazon",
      photo: "https://i.pravatar.cc/150?img=11",
      message: "The GATE qualified alumni on this platform are gems! Their preparation strategies and mock interviews helped me crack GATE with a good score.",
    },
    {
      id: 4,
      name: "Divya Singh",
      company: "Amazon",
      photo: "https://i.pravatar.cc/150?img=14",
      message: "संyुkt38 provides a safe space for meaningful conversations. I can help students without worrying about privacy, and they get genuine guidance.",
    },
    {
      id: 5,
      name: "Vikash Kumar",
      company: "Amazon",
      photo: "https://i.pravatar.cc/150?img=12",
      message: "From resume reviews to mock interviews, the alumni here go above and beyond. I landed internships at two companies through referrals from this network!",
    },
    {
      id: 6,
      name: "Pooja Kumari",
      company: "Amazon",
      photo: "https://i.pravatar.cc/150?img=16",
      message: "The platform's focus on verified alumni ensures quality mentorship. It's amazing to see juniors grow and succeed with proper guidance.",
    }
  ];
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(testimonialInterval);
  }, [testimonials.length]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
  <h1 className="pb-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-green-500 transition-all duration-700 ease-in-out mb-4 leading-tight">
    {headings[index]}
  </h1>
  <p className="text-lg text-gray-600 mb-4 max-w-xl mx-auto">
    A modern platform to connect students with successful alumni for mentorship, networking, and career growth.
  </p>
  {!Studentdata && !Aluminidata && (
    <Link
      to="/signupchoice"
      className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
    >
      Join the Network
    </Link>
  )}
</section>

      


      
{/* Key Highlights Section */}
<section className="bg-gradient-to-r from-blue-50 via-white to-green-50 py-16">
  <div className="max-w-6xl mx-auto px-4 text-center">
    <h2 className="text-3xl font-bold text-gray-800 mb-12">
      Why Our Platform Stands Out
    </h2>
    
    <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
      
      

      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
        <div className="text-4xl mb-4 text-green-500">🎓</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Direct Access to Placed Alumni</h3>
        <p className="text-gray-600">
          Get real guidance on placements, resumes, and referrals directly from those who’ve already succeeded.
        </p>
      </div>


      {/* Card 3 */}
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
        <div className="text-4xl mb-4 text-indigo-500">🎯</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Guidance from GATE Qualified Alumni</h3>
        <p className="text-gray-600">
          Learn directly from alumni who have cracked GATE, gain preparation tips, and understand how it shaped their career paths.
        </p>
      </div>


      {/* Card 1 */}
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
        <div className="text-4xl mb-4 text-blue-500">✔️</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Verified Alumni Only</h3>
        <p className="text-gray-600">
          Receive mentorship exclusively from authenticated alumni, ensuring trustworthy and reliable guidance.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
        <div className="text-4xl mb-4 text-indigo-500">🌐</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
        One Platform for All 38 Colleges
        </h3>
        <p className="text-gray-600">
          Bringing together 38 State Engineering Colleges on one trusted platform for guidance, collaboration, and opportunities.
        </p>
      </div>



      {/* Card 2 */}
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
        <div className="text-4xl mb-4 text-green-500">🛡️</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Confidential & Flexible Support</h3>
        <p className="text-gray-600">
          Alumni can assist students without sharing personal information and help on their own schedule, respecting their free time.
        </p>
      </div>

      {/* Card 4 */}
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
        <div className="text-4xl mb-4 text-purple-500">🔒</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Private Conversations</h3>
        <p className="text-gray-600">
          All chats and communications are fully private, keeping discussions secure between alumni and students.
        </p>
      </div>

    </div>
  </div>
</section>

{/* Why Us Section */}
<section className="bg-gradient-to-b from-gray-50 to-white py-16">
  <div className="max-w-6xl mx-auto px-4">
    {/* Section Heading */}
    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-12 text-center">
      Why संyukt38?
    </h2>

    {/* Cards Grid */}
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
      {/* Mentorship Card */}
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1 duration-300 text-center space-y-4">
        <svg
          className="w-10 h-10 mx-auto text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-blue-600">Mentorship</h3>
        <p className="text-gray-600">
          Get career guidance directly from experienced alumni in your field.
        </p>
      </div>

      {/* Networking Card */}
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1 duration-300 text-center space-y-4">
        <svg
          className="w-10 h-10 mx-auto text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-5M2 7a5 5 0 0110 0v0a5 5 0 01-10 0zM7 14v6h6v-6H7z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-green-600">Networking</h3>
        <p className="text-gray-600">
          Build real professional connections that help you grow beyond college.
        </p>
      </div>

      {/* Opportunities Card */}
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1 duration-300 text-center space-y-4">
        <svg
          className="w-10 h-10 mx-auto text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6h13M9 6l-4 4m0 0l4 4m-4-4h12"
          />
        </svg>
        <h3 className="text-xl font-semibold text-purple-600">Opportunities</h3>
        <p className="text-gray-600">
          Discover internships, referrals, and job opportunities from alumni.
        </p>
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

{/* Testimonial */}

      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 py-16">
  <div className="max-w-6xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
      What Our Alumni Says
    </h2>
    <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
      Hear from our alumni about their experiences, achievements, and how our college shaped their career paths.
    </p>
    
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-10 transform translate-x-16 -translate-y-16"></div>
      
      <div className="relative z-10">
        {/* Profile */}
        <div className="flex items-center mb-6">
          <img
            src={testimonials[currentTestimonial].photo}
            alt={testimonials[currentTestimonial].name}
            className="w-16 h-16 rounded-full border-4 border-blue-500 object-cover mr-4"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {testimonials[currentTestimonial].name}
            </h3>
            {testimonials[currentTestimonial].company && (
              <span className="inline-block mt-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                {testimonials[currentTestimonial].company}
              </span>
            )}
          </div>
        </div>
        
        {/* Quote */}
        <div className="text-4xl text-blue-400 mb-4">"</div>
        <p className="text-gray-700 text-lg leading-relaxed mb-6 pl-8">
          {testimonials[currentTestimonial].message}
        </p>

        {/* Testimonial Navigation */}
        <div className="flex space-x-2 justify-center">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === currentTestimonial 
                  ? 'bg-blue-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => setCurrentTestimonial(idx)}
            />
          ))}
        </div>
      </div>
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
      Connect with mentors, explore opportunities, and grow with संyukt38.
    </p>
    {!Studentdata&&!Aluminidata&&<Link
      to="/signupchoice"
      className="inline-block bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Create Your Account
    </Link>}
  </div>
</section>


    </div>
  );
}
