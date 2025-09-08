import SignupPageUser from "./SignupPageUser";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./Body";
import Home from "./Home";
import SignupChoice from "./SignupChoice";
import appStore from "./utils/appStore";
import { Provider } from "react-redux";
import LandingPage from "./LandingPage";
import SignupPageAlumini from "./SignupPageAlumini";
import EmailVerificationUser from "./EmailverifictionUser";
import EmailVerificationAlumini from "./EmailVerificationAlumini";
import LoginSelectorPage from "./LoginSelectorPage";
import LoginUser from "./components/LoginAllRole/LoginUser";
import LoginAdmin from "./components/LoginAllRole/LoginAdmin";
import LoginAlumini from "./components/LoginAllRole/LoginAlumini";
import Shimmer from "./Shimmer";
import EditProfileAlumni from "./EditProfileAlumni";
import EditProfileUser from "./EditProfileUser";
import EmailVerificationAdmin from "./EmailVerificationAdmin";
import SignupPageAdmin from "./SignupPageAdmin";
import EditProfileAdmin from "./EditProfileAdmin";
import MyMentors from "./MyMentors";
import AlumniMentees from "./AlumniMentees";
import AlumniReceivedRequest from "./AlumniRecievedRequest";
import AlumniBlocked from "./AlumniBlocked";
import Chat from "./components/Chat";
import About from "./About";
import AlumniProfilePage from "./AlumniProfilePage";
import AdminAlumniList from "./components/Admin/AdminAlumniList";
import StudentList from "./components/Admin/StudentList";
import AdminAlumniRequests from "./components/Admin/AdminAlumniRequests";
import ChatHelpPage from "./components/ChatHelp";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AddAlumniAdmin from "./AddAlumniAdmin";
import AdminStudentRequests from "./components/Admin/AdminStudentRequests";
import ForgotPasswordOtp from "./ForgotPasswordOtp";
import ResetPassword from "./ResetPassword";
import ForgotPasswordOtpAdmin from "./ForgotPasswordOtpAdmin";
import ForgotPasswordOtpAlumni from "./ForgotPasswordOtpAlumni";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            {/* Public routes (restricted when logged in) */}
            {/* <Route path="/" element={<Home />} /> */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Home />
                </PublicRoute>
              }
            />
            <Route
              path="/loginuser"
              element={
                <PublicRoute>
                  <LoginUser />
                </PublicRoute>
              }
            />
            <Route
              path="/loginadmin"
              element={
                <PublicRoute>
                  <LoginAdmin />
                </PublicRoute>
              }
            />
            <Route
              path="/loginalumini"
              element={
                <PublicRoute>
                  <LoginAlumini />
                </PublicRoute>
              }
            />
            <Route
              path="/loginselectorpage"
              element={
                <PublicRoute>
                  <LoginSelectorPage />
                </PublicRoute>
              }
            />
            <Route path="/shimmer" element={<Shimmer />} />
            <Route
              path="/signupchoice"
              element={
                <PublicRoute>
                  <SignupChoice />
                </PublicRoute>
              }
            />
            <Route
              path="/emailverificationuser"
              element={
                <PublicRoute>
                  <EmailVerificationUser />
                </PublicRoute>
              }
            />
            <Route
              path="/emailverificationalumini"
              element={
                <PublicRoute>
                  <EmailVerificationAlumini />
                </PublicRoute>
              }
            />
            <Route
              path="/emailverificationadmin"
              element={
                <PublicRoute>
                  <EmailVerificationAdmin />
                </PublicRoute>
              }
            />
            <Route
  path="/forgotpasswordotp"
  element={
    <PublicRoute>
      <ForgotPasswordOtp />
    </PublicRoute>
  }
/>
<Route
  path="/resetpassword"
  element={
    <PublicRoute>
      <ResetPassword />
    </PublicRoute>
  }
/>
          <Route
  path="/forgotpasswordotpalumni"
  element={
    <PublicRoute>
      <ForgotPasswordOtpAlumni/>
    </PublicRoute>
  }
/>
          <Route
  path="/forgotpasswordotpadmin"
  element={
    <PublicRoute>
      <ForgotPasswordOtpAdmin/>
    </PublicRoute>
  }
/>

            <Route
              path="/signupuser"
              element={
                <PublicRoute>
                  <SignupPageUser />
                </PublicRoute>
              }
            />
            <Route
              path="/signupalumini"
              element={
                <PublicRoute>
                  <SignupPageAlumini />
                </PublicRoute>
              }
            />
            <Route
              path="/signupadmin"
              element={
                <PublicRoute>
                  <SignupPageAdmin />
                </PublicRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/chathelp" element={<ChatHelpPage />} />

            {/* Student-only */}
            <Route
              path="/mymentors"
              element={
                <ProtectedRoute role="student">
                  <MyMentors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/landingpage"
              element={
                <ProtectedRoute role="student">
                  <LandingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editprofileuser"
              element={
                <ProtectedRoute role="student">
                  <EditProfileUser />
                </ProtectedRoute>
              }
            />

            {/* Alumni-only */}
            <Route
              path="/alumnimentees"
              element={
                <ProtectedRoute role="alumni">
                  <AlumniMentees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumniblocked"
              element={
                <ProtectedRoute role="alumni">
                  <AlumniBlocked />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumnirecievedrequest"
              element={
                <ProtectedRoute role="alumni">
                  <AlumniReceivedRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editprofilealumni"
              element={
                <ProtectedRoute role="alumni">
                  <EditProfileAlumni />
                </ProtectedRoute>
              }
            />

            {/* Admin-only */}
            <Route
              path="/editprofileadmin"
              element={
                <ProtectedRoute role="admin">
                  <EditProfileAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/getalumnilist"
              element={
                <ProtectedRoute role="admin">
                  <AdminAlumniList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/getstudentlist"
              element={
                <ProtectedRoute role="admin">
                  <StudentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recivedrequestfromalumni"
              element={
                <ProtectedRoute role="admin">
                  <AdminAlumniRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addalumniadmin"
              element={
                <ProtectedRoute role="admin">
                  <AddAlumniAdmin/>
                </ProtectedRoute>
              }
            />

            <Route
              path="/recivedrequestfromstudent"
              element={
                <ProtectedRoute role="admin">
                  <AdminStudentRequests/>
                </ProtectedRoute>
              }
            />

            {/* Both Student + Alumni */}
            <Route
              path="/chat/:touserId"
              element={
                <ProtectedRoute role="both">
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/:id"
              element={
                <ProtectedRoute role="both">
                  <AlumniProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>

  
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
