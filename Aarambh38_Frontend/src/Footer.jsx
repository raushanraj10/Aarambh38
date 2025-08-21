import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "./constants/AllUrl";
import toast, { Toaster } from "react-hot-toast";

export default function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [usermessage, setusermessage] = useState("");
  const [useremail, setuseremail] = useState("");
  const [usersubject, setusersubject] = useState("");
  const [isSending, setIsSending] = useState(false); // prevent double click

  const handlesend = async () => {
    if (isSending) return;

    setIsSending(true);
    try {
      await axios.post(
        `${BASE_URL}/sendemailbyuser`,
        { useremail, usermessage, subject: usersubject },
        { withCredentials: true }
      );

      toast.success("Email sent successfully!");
      setShowContact(false);
      setuseremail("");
      setusermessage("");
      setusersubject("");
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  const popupRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPrivacy(false);
        setShowContact(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <footer className="relative bg-white border-t border-gray-200 text-gray-600">
      {/* Toaster for notifications */}
      <Toaster
  toastOptions={{
    className: "bg-white shadow-lg rounded-lg px-4 py-2 text-sm",
    style: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // center
    },
  }}
/>


      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-500 mb-4 md:mb-0 text-center md:text-left">
          © {new Date().getFullYear()}{" "}
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight">
            Aarambh38
          </span>
          . All rights reserved.
        </p>

        <div className="relative flex gap-4 items-center">
          <Link
            to="/about"
            className="hover:text-blue-600 text-sm font-medium transition"
          >
            About
          </Link>

          <button
            onClick={() => setShowPrivacy(!showPrivacy)}
            className="hover:text-blue-600 text-sm font-medium transition"
          >
            Privacy
          </button>

          <button
            onClick={() => setShowContact(!showContact)}
            className="hover:text-blue-600 text-sm font-medium transition"
          >
            Contact Us
          </button>

          {/* Privacy Popup */}
          {showPrivacy && (
  <div
    ref={popupRef}
    className="absolute bottom-12 left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 w-80 bg-white border border-gray-200 shadow-lg p-4 rounded-lg z-50"
  >
    <h3 className="text-base font-semibold mb-2">Privacy Policy</h3>
    <p className="text-sm text-gray-600 mb-2">
      We respect your privacy. Your data is safe and will not be shared with third parties.
    </p>
    <p className="text-sm text-gray-600 mb-2">
      Only students and alumni of{" "}
      <span className="font-semibold text-blue-600">
        Bihar Engineering University
      </span>{" "}
      are allowed to register and access this platform.
    </p>
    <p className="text-sm text-gray-600">
      Only <span className="font-semibold text-green-600">Aarambh38 verified alumni</span> are shown in the student dashboard, allowing them to provide guidance privately without sharing their personal contact info.
    </p>
  </div>
)}


          {/* Contact Us Popup */}
          {showContact && (
            <div
              ref={popupRef}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 w-96 bg-white border border-gray-200 shadow-lg p-4 rounded-lg z-50"
            >
              <h3 className="text-base font-semibold mb-2">Contact Us</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlesend();
                }}
              >
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={useremail}
                    onChange={(e) => setuseremail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-md mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={usersubject}
                    onChange={(e) => setusersubject(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-md mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    rows="3"
                    value={usermessage}
                    onChange={(e) => setusermessage(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-md mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSending}
                  className={`w-full py-2 text-sm font-medium text-white rounded-md ${
                    isSending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-green-600 hover:opacity-90"
                  }`}
                >
                  {isSending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
