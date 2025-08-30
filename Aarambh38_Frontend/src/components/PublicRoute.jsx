import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const student = useSelector((store) => store.studentdata);
  const alumni = useSelector((store) => store.aluminidata);
  const admin = useSelector((store) => store.admindata);

  if (student) return <Navigate to="/landingpage" replace />;
  if (alumni) return <Navigate to="/alumnimentees" replace />;
  if (admin) return <Navigate to="/recivedrequestfromalumni" replace />;

  return children; // if not logged in, allow access
};

export default PublicRoute;
