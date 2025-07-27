import React from "react";
import { User, Info, HelpCircle, MapPin, Calendar, Settings2 } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
          About <span className="text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-green-200">Aarambh38</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">
          A modern mentorship and alumni-student connection platform designed for clarity, career growth, and collaboration.
        </p>
      </div>

      {/* WH Sections */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-10">
        {/* Who */}
        {/* <div className="flex items-start gap-4">
          <User className="text-blue-600 w-8 h-8" />
          <div>
            <h2 className="text-2xl font-semibold">Who built it?</h2>
            <p>
              <strong>Raushan Raj</strong> and <strong>Shikha Kumari</strong> — passionate tech enthusiasts and students — created Aarambh38
              to simplify and enhance the alumni-student mentoring process.
            </p>
          </div>
        </div> */}

        {/* What */}
        <div className="flex items-start gap-4">
          <Info className="text-green-600 w-8 h-8" />
          <div>
  <h2 className="text-2xl font-semibold text-blue-700 mb-2">What is Aarambh38?</h2>
  <p className="text-gray-700 leading-relaxed">
    <span className="font-semibold">Aarambh38</span> is a comprehensive digital mentorship platform designed to bridge the gap between current students and their alumni from engineering colleges across Bihar. 
    It serves as a hub for students seeking mentorship, career guidance, placement preparation, and real-world insights directly from those who have walked the same path before them.
  </p>
  <p className="mt-3 text-gray-700 leading-relaxed">
    The name <span className="font-semibold text-green-600">Aarambh38</span> signifies a new beginning — “Aarambh” meaning "beginning" in Hindi — and the number 38 represents the <span className="font-semibold">38 government engineering colleges</span> under the Bihar Engineering University (BEU), Patna. 
    It symbolizes a collective platform for students from all these institutions to connect, grow, and succeed together with the support of their alumni network.
  </p>
</div>

        </div>

        {/* Why */}
 <div className="flex items-start gap-4">
  <HelpCircle className="text-blue-600 w-8 h-8 mt-1" />
  <div>
    <h2 className="text-2xl font-semibold text-blue-700 mb-2">Why was it built?</h2>
    <p className="text-gray-700 leading-relaxed">
      In today’s competitive environment, students often struggle to access real-world guidance, personalized mentorship, and effective placement strategies. 
      Despite having talented alumni across various industries, many students remain disconnected from this invaluable resource.
    </p>
    <p className="mt-3 text-gray-700 leading-relaxed">
      <span className="font-semibold text-green-600">Aarambh38</span> was created to solve this gap — by offering a streamlined platform where students from Bihar's 38 government engineering colleges can effortlessly connect with alumni. 
      Through this platform, students can receive mentorship, ask questions, gain career insights, and even request referrals when relevant, helping them take confident steps toward their goals.
    </p>
    <p className="mt-3 text-gray-700 leading-relaxed">
      Whether it's understanding industry expectations, clarifying career paths, preparing for interviews, or simply getting inspiration — Aarambh38 ensures that guidance is just a few clicks away.
    </p>
  </div>
</div>


        {/* When */}
        <div className="flex items-start gap-4">
  <Calendar className="text-green-600 w-8 h-8 mt-1" />
  <div>
    <h2 className="text-2xl font-semibold text-blue-700 mb-2">When was it started?</h2>
    <p className="text-gray-700 leading-relaxed">
      <span className="font-semibold">Aarambh38</span> was officially launched in <strong>2025</strong> with the vision of empowering students across Bihar’s government engineering colleges through meaningful alumni connections.
      It began as a simple idea — to make guidance and mentorship more accessible — and quickly evolved into a full-fledged platform.
    </p>
    <p className="mt-3 text-gray-700 leading-relaxed">
      Since its inception, Aarambh38 has steadily grown in both features and impact. From basic student-alumni profiles, it has expanded to include <span className="font-semibold text-green-600">real-time chat capabilities</span>, intelligent <span className="font-semibold text-green-600">request and approval handling</span>, as well as secure and dynamic <span className="font-semibold text-green-600">profile management systems</span>.
    </p>
    <p className="mt-3 text-gray-700 leading-relaxed">
      As the needs of students and alumni continue to grow, so does Aarambh38 — with a commitment to regularly introducing new features, enhancing user experience, and building a strong mentorship ecosystem for years to come.
    </p>
  </div>
</div>


        {/* Where */}
        <div className="flex items-start gap-4">
  <MapPin className="text-blue-600 w-8 h-8 mt-1" />
  <div>
    <h2 className="text-2xl font-semibold text-blue-700 mb-2">Where does it apply?</h2>
    <p className="text-gray-700 leading-relaxed">
      <span className="font-semibold">Aarambh38</span> is a platform built specifically for the students and alumni of the 
      <span className="font-semibold text-green-600"> 38 government engineering colleges </span> affiliated with 
      <span className="font-semibold"> Bihar Engineering University (BEU), Patna</span>.
      Access to the platform is limited to verified students and graduates from these institutions to ensure a focused, trusted, and relevant mentorship network.
    </p>
    <p className="mt-3 text-gray-700 leading-relaxed">
      While the core infrastructure and design principles of Aarambh38 could be adapted for institutions across India or even globally, the current implementation is tailored exclusively to serve the needs of Bihar’s engineering community — fostering a close-knit, impactful ecosystem of peer support, guidance, and career development.
    </p>
  </div>
</div>


        {/* How */}
 <div className="flex items-start gap-4">
  <Settings2 className="text-green-600 w-8 h-8 mt-1" />
  <div>
    <h2 className="text-2xl font-semibold text-blue-700 mb-2">How does it work?</h2>
    <p className="text-gray-700 leading-relaxed">
      <span className="font-semibold">Aarambh38</span> follows a simple and intuitive flow designed to connect students and alumni effortlessly. 
      Verified students can log into the platform, explore a curated list of alumni profiles from their college, and send personalized connection requests for mentorship or guidance.
    </p>
    <p className="mt-3 text-gray-700 leading-relaxed">
      Once an alumni accepts the request, a secure real-time <span className="font-semibold text-green-600">chat interface</span> becomes active, enabling direct, one-on-one communication. 
      Students can then ask questions, seek career advice, request referrals, or just have meaningful conversations about opportunities and challenges in their field.
    </p>
    <p className="mt-3 text-gray-700 leading-relaxed">
      The platform is built using a robust tech stack — a modern <span className="font-semibold">React-based frontend</span> ensures a fast and smooth user experience, while powerful <span className="font-semibold">Node.js and Express APIs</span> manage data, authentication, and connections on the backend.
    </p>
    <p className="mt-3 text-gray-700 leading-relaxed">
      Every action — from discovering mentors to initiating chats — is designed to be simple, secure, and scalable, ensuring that students can focus on learning and growing with the guidance of their alumni network.
    </p>
  </div>
</div>

      </div>

      {/* Creator Credits */}
      <div className="bg-gray-100 py-10 text-center">
  <p className="text-md text-gray-700 transition-opacity duration-1000 opacity-80 hover:opacity-100">
    Designed & Developed by{" "}
    <span className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-300">
      Raushan Raj, Shikha Kumari
    </span>{" "}
    <span className="text-gray-500 font-medium">&nbsp;from&nbsp;</span>
    <span className="font-semibold text-green-600 hover:text-green-700 transition-colors duration-300">
      BCE Patna
    </span>
  </p>
</div>

    </div>
  );
};

export default About;
