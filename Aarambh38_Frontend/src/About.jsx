
import React from "react";
import { User, Info, HelpCircle, MapPin, Calendar, Settings2 } from "lucide-react";

const About = () => {
  const sections = [
    {
      icon: Info,
      color: "text-green-600",
      title: "What is संyukt38?",
      content: (
        <>
          संyukt38 is a dynamic mentorship platform connecting students from Bihar’s 38 government engineering colleges with experienced alumni,
          facilitating career guidance, placement prep, and meaningful networking.
        </>
      ),
    },
    {
      icon: HelpCircle,
      color: "text-blue-600",
      title: "Why was it built?",
      content: (
        <>
          Designed to overcome the mentorship gap, संyukt38 links students directly with alumni, empowering informed career decisions and referral opportunities.
        </>
      ),
    },
    {
      icon: Calendar,
      color: "text-green-600",
      title: "When was it started?",
      content: (
        <>
          Launched in 2025, संyukt38 has evolved with user-centric features—real-time chats, profile security, and seamless request handling—to foster a thriving mentorship ecosystem.
        </>
      ),
    },
    {
      icon: MapPin,
      color: "text-blue-600",
      title: "Where does it apply?",
      content: (
        <>
          Exclusively for verified students and alumni of Bihar Engineering University’s 38 affiliated government colleges, providing a focused and trusted network.
        </>
      ),
    },
    {
      icon: User,
      color: "text-blue-600",
      title: "Who guides you?",
      content: (
        <>
          Students connect with GATE-qualified mentors and placed alumni from top organizations, gaining strategized guidance for higher studies and placements.
        </>
      ),
    },
    {
      icon: Settings2,
      color: "text-green-600",
      title: "How does it work?",
      content: (
        <>
          Students browse curated alumni profiles, send connection requests, and chat securely after acceptance, with all communications fully private and confidential.
        </>
      ),
    },
  ];

  const mentors = [
    {
      name: "Prof. ABCD",
      role: "Faculty, BCE Patna",
      img: "https://media.istockphoto.com/id/1455786460/vector/the-person-giving-the-lecture-speech-silhouette-icon-vector.jpg?s=612x612&w=0&k=20&c=FXJxAXD0XsfnLGQE5ssBnwZ3NbrsgyUXspbx_FkaQds=",
      description:
        "Guiding संyukt38 as part of the mentorship & alumni-student initiative, providing expert advice and support.",
    },
    {
      name: "Dr. XYZ",
      role: "Senior Mentor, BCE Patna",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      description: "Experienced mentor focusing on career development, industry connections, and student motivation.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">

      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-blue-700 to-green-600 text-white text-center py-24 px-6 overflow-hidden shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4 drop-shadow-lg">
          About संyukt38
        </h1>
        <p className="mt-6 text-lg max-w-3xl mx-auto leading-relaxed tracking-wide drop-shadow-md">
          Your bridge to mentorship, career growth, and collaboration across Bihar’s 38 government engineering colleges.
        </p>

        {/* Decorative shape */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 opacity-10 pointer-events-none select-none">
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
              onFocus={(e) => e.target.blur()} // Remove blue focus ring on click
              aria-labelledby={`section-title-${idx}`}
            >
              <div className="flex items-center mb-5 gap-3">
                <Icon className={`${color} w-6 h-6 mt-0.5`} aria-hidden="true" />
                <h2 id={`section-title-${idx}`} className="text-lg font-semibold text-gray-800 flex-1">
                  {title}
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed flex-grow text-base">{content}</p>
            </article>
          ))}
        </div>

        {/* Mentors Section */}
        <section className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 bg-white rounded-2xl shadow p-8">
          {mentors.map(({ name, role, img, description }, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-lg"
            >
              <img
                src={img}
                alt={name}
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-600 mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
              <p className="text-sm text-indigo-600 font-medium mb-4">{role}</p>
              <p className="text-gray-700 text-base leading-relaxed">{description}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-10 mt-16 text-center border-t border-gray-200">
        <p className="text-gray-600 font-medium text-sm tracking-wide">
          Designed & Developed by{" "}
          <a href="#" className="text-blue-700 hover:text-blue-900 font-semibold transition-colors">
            Raushan Raj, Shikha Kumari
          </a>{" "}
          from{" "}
          <a href="#" className="text-green-700 hover:text-green-900 font-semibold transition-colors">
            BCE Patna
          </a>
        </p>
      </footer>
    </div>
  );
};

export default About;
