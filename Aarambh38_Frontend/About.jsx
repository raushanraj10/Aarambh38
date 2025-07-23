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
            <h2 className="text-2xl font-semibold">What is Aarambh38?</h2>
            <p>
              Aarambh38 is a digital platform that connects students with alumni from their institute for mentorship, guidance,
              placement advice, and real-world knowledge sharing.
            </p>
          </div>
        </div>

        {/* Why */}
        <div className="flex items-start gap-4">
          <HelpCircle className="text-blue-600 w-8 h-8" />
          <div>
            <h2 className="text-2xl font-semibold">Why was it built?</h2>
            <p>
              Students often lack access to real-world advice, placement strategies, or career clarity.
              Aarambh38 provides a structured bridge to alumni who can guide, mentor, and support.
            </p>
          </div>
        </div>

        {/* When */}
        <div className="flex items-start gap-4">
          <Calendar className="text-green-600 w-8 h-8" />
          <div>
            <h2 className="text-2xl font-semibold">When was it started?</h2>
            <p>
              The project was started in <strong>2025</strong> and continues to evolve with features like real-time chat,
              request handling, and profile systems.
            </p>
          </div>
        </div>

        {/* Where */}
        <div className="flex items-start gap-4">
          <MapPin className="text-blue-600 w-8 h-8" />
          <div>
            <h2 className="text-2xl font-semibold">Where does it apply?</h2>
            <p>
              Primarily designed for colleges and universities in India, Aarambh38 can be expanded for institutions
              worldwide seeking mentorship platforms.
            </p>
          </div>
        </div>

        {/* How */}
        <div className="flex items-start gap-4">
          <Settings2 className="text-green-600 w-8 h-8" />
          <div>
            <h2 className="text-2xl font-semibold">How does it work?</h2>
            <p>
              Students log in, discover alumni, and send connection requests. Once accepted, a chat system allows
              seamless communication — all powered by a modern React frontend and backend APIs.
            </p>
          </div>
        </div>
      </div>

      {/* Creator Credits */}
      <div className="bg-gray-100 py-10 text-center">
        <p className="text-md text-gray-700">
          Designed and Developed by <span className="font-bold text-blue-600">Raushan Raj</span> &amp;{" "}
          <span className="font-bold text-green-600">Shikha Kumari</span>
        </p>
      </div>
    </div>
  );
};

export default About;
