import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const popupRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPrivacy(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <footer className="relative bg-white border-t border-gray-200 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-500 mb-4 md:mb-0 text-center md:text-left">
          © {new Date().getFullYear()}{" "}
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight">
            Aarambh38
          </span>. All rights reserved.
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

          {showPrivacy && (
            <div
              ref={popupRef}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 w-80 bg-white border border-gray-200 shadow-lg p-4 rounded-lg z-50"
            >
              <h3 className="text-base font-semibold mb-2">Privacy Policy</h3>
              <p className="text-sm text-gray-600 mb-2">
                We respect your privacy. Your data is safe and will not be shared with third parties.
              </p>
              <p className="text-sm text-gray-600">
                Only students and alumni of{" "}
                <span className="font-semibold text-blue-600">
                  Bihar Engineering University
                </span>{" "}
                are allowed to register and access this platform. Other users will not be accepted.
              </p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
