import React from "react";
import { User, Info, HelpCircle, MapPin, Calendar, Settings2 } from "lucide-react";
import principalimg from "./assets/images/principal.png";
import shahiruddin from "./assets/images/shahiruddin.jpg"
import rajeev from "./assets/images/rajeev_ranjan.png"
import vikash from "./assets/images/vikash.png"
import ajeet from "./assets/images/ajeet_sir.jpg"
import saquib from "./assets/images/sahab_saquib.jpg"

// Sections for about cards
const sections = [
  {
    icon: Info,
    color: "text-green-600",
    title: "What is संyukt38?",
    content:
      "संyukt38 is a dynamic mentorship platform connecting students from Bihar's 38 government engineering colleges with experienced alumni, facilitating career guidance, placement prep, and meaningful networking.",
  },
  {
    icon: HelpCircle,
    color: "text-blue-600",
    title: "Why was it built?",
    content:
      "Designed to overcome the mentorship gap, संyukt38 links students directly with alumni, empowering informed career decisions and referral opportunities.",
  },
  {
    icon: Calendar,
    color: "text-green-600",
    title: "When was it started?",
    content:
      "Launched in 2025, संyukt38 has evolved with user-centric features—real-time chats, profile security, and seamless request handling—to foster a thriving mentorship ecosystem.",
  },
  {
    icon: MapPin,
    color: "text-blue-600",
    title: "Where does it apply?",
    content:
      "Exclusively for verified students and alumni of Bihar Engineering University's 38 affiliated government colleges, providing a focused and trusted network.",
  },
  {
    icon: User,
    color: "text-blue-600",
    title: "Who guides you?",
    content:
      "Students connect with GATE-qualified mentors and placed alumni from top organizations, gaining strategized guidance for higher studies and placements.",
  },
  {
    icon: Settings2,
    color: "text-green-600",
    title: "How does it work?",
    content:
      "Students browse curated alumni profiles, send connection requests, and chat securely after acceptance, with all communications fully private and confidential.",
  },
];

// Principal card data (removed from mentors)
const principal = {
  name: "Dr. Kumar Surendra",
  role: "Principal, BCE Patna",
  // img: "https://randomuser.me/api/portraits/men/55.jpg", // Use actual base64 or URL value
  img: principalimg,
  description:
    "Empowering संyukt38 with vision and dedication to inspire student growth.",
};

// Mentors array - all others except principal
const mentors = [
  {
    name: "Dr. Shahiruddin",
    role: "Dean",
    img: shahiruddin,
    description:
      "Oversees academic affairs and upholds the institution’s standards of excellence.",
  },
  {
    name: "Prof. Rajeev Ranjan",
    role: "Training & Placement Officer, BCE Patna ",
    img: rajeev,
    description:
      "Facilitates student placements, industry collaborations, and career development opportunities.",
  },
  {
    name: "Prof. Shahab Saquib",
    role: "Assistant Professor(HOD CSE)",
    img: saquib,
    description:
      "Guides students in computer science education, fostering skills in coding, research, and projects.",
  },
  {
    name: "Dr. Vikash Kumar",
    role: "Assistant Professor",
    img: vikash,
    description:
      "Dedicated to advancing student success through academic guidance and career-focused mentorship.",
  },
  {
    name: "Prof. Ajeet Kumar",
    role: "Assistant Professor",
    img:ajeet,
    description:
      "Committed to enhancing student learning, research engagement, and academic excellence.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-blue-700 to-green-600 text-white text-center py-24 px-6 overflow-hidden shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4 drop-shadow-lg">
          About yukt38
        </h1>
        <p className="mt-6 text-lg max-w-3xl mx-auto leading-relaxed tracking-wide drop-shadow-md">
          Your bridge to mentorship, career growth, and collaboration across Bihar's 38 government engineering colleges.
        </p>
        {/* Decorative shape */}
        <div className="absolute top-0 left-12 transform -translate-x-12 opacity-10 pointer-events-none select-none">
          <svg width="400" height="400" fill="none" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="200" fill="white" />
          </svg>
        </div>
      </header>

      {/* Content Sections */}
      <main className="max-w-7xl mx-auto p-6 space-y-20 mt-8">
        {/* About Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {sections.map(({ icon: Icon, color, title, content }, idx) => (
            <article
              key={idx}
              tabIndex={-1}
              className="bg-white rounded-3xl shadow transition-shadow hover:shadow-2xl p-6 flex flex-col h-full cursor-default"
              aria-labelledby={`section-title-${idx}`}
              onFocus={e => e.target.blur()} // Remove blue focus ring on click
            >
              <div className="flex items-center mb-5 gap-3">
                <Icon className={color + " w-6 h-6 mt-0.5"} aria-hidden="true" />
                <h2 id={`section-title-${idx}`} className="text-lg font-semibold text-gray-800 flex-1">
                  {title}
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed flex-grow text-base">{content}</p>
            </article>
          ))}
        </div>

        {/* Principal Card above Mentors */}
        <div className="max-w-2xl mx-auto mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Head of Institution</h2>
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
            <img
              src={principal.img}
              alt={principal.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-600 mb-3"
            />
            <h3 className="text-base font-semibold text-gray-900">{principal.name}</h3>
            <p className="text-xs text-indigo-600 font-medium mb-2">{principal.role}</p>
            <p className="text-xs text-gray-600 leading-snug">{principal.description}</p>
          </div>
        </div>


        {/* Mentors Section */}
        <section className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10">Mentors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
            {mentors.map(({ name, role, img, description }, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center"
              >
                <img
                  src={img}
                  alt={name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-blue-600 mb-3"
                />
                <h3 className="text-sm md:text-base font-semibold text-gray-900">{name}</h3>
                <p className="text-xs text-indigo-600 font-medium mb-2">{role}</p>
                <p className="text-xs text-gray-600 leading-snug line-clamp-3">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-10 mt-16 text-center border-t border-gray-200">
        <p className="text-gray-600 font-medium text-sm tracking-wide">
          Designed & Developed by
          <a
            className="text-green-700 hover:text-green-900 font-semibold transition-colors"
            href="#"
          >
            &nbsp;BCE Patna Student
          </a>
        </p>
      </footer>
    </div>
  );
};

export default About;