// import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Shimmer from "./Shimmer";
// import { useDispatch } from "react-redux";
// import axios from "axios";
import { BASE_URL } from "./constants/AllUrl";
// import { addstudent } from "./utils/StudentSlice";
// import { addalumini } from "./utils/AluminiSlice";
// import { addadmin } from "./utils/AdminSlice";

const Body = () => {
  // const [loading, setLoading] = useState(true);
  // const dispatch = useDispatch();

  // const callstudent = async () => {
  //   try {
  //     const res = await axios.get(`${BASE_URL}/getstudentprofile`, { withCredentials: true });
  //     dispatch(addstudent(res.data));
  //   } catch (error) {
  //     console.error("Student fetch failed:", error);
  //   }
  // };

  // const callalumni = async () => {
  //   try {
  //     const res = await axios.get(`${BASE_URL}/getalumniprofile`, { withCredentials: true });
  //     dispatch(addalumini(res.data));
  //   } catch (error) {
  //     console.error("Alumni fetch failed:", error);
  //   }
  // };

  // const calladmin = async () => {
  //   try {
  //     const res = await axios.get(`${BASE_URL}/getadminprofile`, { withCredentials: true });
  //     dispatch(addadmin(res.data));
  //   } catch (error) {
  //     console.error("Admin fetch failed:", error);
  //   }
  // };

  // useEffect(() => {
  //   const loadData = async () => {
  //     await Promise.all([callstudent(), callalumni(), calladmin()]);
  //     setLoading(false);
  //   };

  //   loadData();
  // }, []);

  // if (loading) return <Shimmer />;

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
