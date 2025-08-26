import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const student = useSelector((store) => store.studentdata);
  const alumni = useSelector((store) => store.aluminidata);
  const admin = useSelector((store) => store.admindata);

  // role = "student" | "alumni" | "admin" | "both"
  if (role === "student") {
    return student ? children : <Navigate to="/loginuser" replace />;
  }

  if (role === "alumni") {
    return alumni ? children : <Navigate to="/loginalumini" replace />;
  }

  if (role === "admin") {
    return admin ? children : <Navigate to="/loginadmin" replace />;
  }

  if (role === "both") {
    return student || alumni ? children : <Navigate to="/loginselectorpage" replace />;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
