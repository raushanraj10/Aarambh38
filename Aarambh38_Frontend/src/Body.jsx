import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Shimmer from "./Shimmer";

const Body = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (you can adjust this or replace with actual async logic)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Shimmer />;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
