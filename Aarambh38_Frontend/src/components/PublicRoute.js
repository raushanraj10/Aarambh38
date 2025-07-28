// components/ProtectedRoute.js
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const Navigate=useNavigate()
  const Studentdata = useSelector((store) => store.studentdata); // Adjust path based on your slice
  const Alumnidata = useSelector((store) => store.alumnidata);
  const Admindata = useSelector((store) => store.admindata);
  if (Studentdata) {
    return (Navigate("/landingpage"));
  }

  if (Alumnidata) {
    return (Navigate("/alumnimentees"));
  }

  if (Admindata) {
    return (Navigate("/editprofileadmin"));
  }

  return children;
};

export default PublicRoute;
