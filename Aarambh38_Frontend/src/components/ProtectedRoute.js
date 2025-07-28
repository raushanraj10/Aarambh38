import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";


const ProtectedRoute = ({ children }) => {
    const Navigate =useNavigate()
  const student = useSelector((store) => store.studentdata);
  const alumni = useSelector((store) => store.alumnidata);
  const admin = useSelector((store) => store.admindata);

  if (!student && !alumni && !admin) {
    return (Navigate("/loginselectorpage"));
  }

  return children;
};

export default ProtectedRoute;
