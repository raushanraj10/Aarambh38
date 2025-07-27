import SignupPageUser from "./SignupPageUser"
 import { BrowserRouter,Routes,Route, RouterProvider } from "react-router-dom"
 import Body from "./Body"
import Navbar from "./Navbar"
import Home from "./Home"
import Login from "./components/LoginAllRole/LoginUser"
import SignupChoice from "./SignupChoice"
import appStore from "./utils/appStore"
import { Provider } from 'react-redux'
import LandingPage from "./LandingPage"
import SignupPageAlumini from "./SignupPageAlumini"
import EmailVerificationUser from "./EmailverifictionUser"
import EmailVerificationAlumini from "./EmailVerificationAlumini"
import LoginSelectorPage from "./LoginSelectorPage"
import LoginUser from "./components/LoginAllRole/LoginUser"
import LoginAdmin from "./components/LoginAllRole/LoginAdmin"
import LoginAlumini from "./components/LoginAllRole/LoginAlumini"
import Shimmer from "./Shimmer"
import EditProfileAlumni from "./EditProfileAlumni"
import EditProfileUser from "./EditProfileUser"
import EmailVerificationAdmin from "./EmailVerificationAdmin"
import SignupPageAdmin from "./SignupPageAdmin"
import EditProfileAdmin from "./EditProfileAdmin"
import MyMentors from "./MyMentors"
import AlumniMentees from "./AlumniMentees"
import AlumniReceivedRequest from "./AlumniRecievedRequest"
import AlumniBlocked from "./AlumniBlocked"
import Chat from "./components/Chat"
import About from "./About"
import AlumniProfilePage from "./AlumniProfilePage"

function App() {
  

  return (
    <Provider store={appStore}>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body />}>
        <Route path="/" element={<Home/>}/>
        <Route path="/loginuser" element={<LoginUser/>}/>
        <Route path="/loginadmin" element={<LoginAdmin/>}/>
        <Route path="/loginalumini" element={<LoginAlumini/>}/>
        <Route path="/loginselectorpage" element={<LoginSelectorPage/>}/>
        <Route path="/shimmer" element={<Shimmer/>}/>
        <Route path="/mymentors" element={<MyMentors/>}/>
        <Route path="/alumnimentees" element={<AlumniMentees/>}/>
        <Route path="/alumniblocked" element={<AlumniBlocked/>}/>
        <Route path="/alumnirecievedrequest" element={<AlumniReceivedRequest/>}/>
        <Route path="/landingpage" element={<LandingPage/>}/>
        <Route path="editprofilealumni" element={<EditProfileAlumni/>}/>
        <Route path="editprofileuser" element={<EditProfileUser/>}/>
        <Route path="editprofileadmin" element={<EditProfileAdmin/>}/>
        <Route path="/signupchoice" element={<SignupChoice/>} />
        <Route path="/emailverificationuser" element={<EmailVerificationUser/>} />
        <Route path="/emailverificationalumini" element={<EmailVerificationAlumini/>} />
        <Route path="/emailverificationadmin" element={<EmailVerificationAdmin/>} />
          <Route path="/signupuser" element={<SignupPageUser />} />
           <Route path="/signupalumini" element={<SignupPageAlumini/>} />
           <Route path="/signupadmin" element={<SignupPageAdmin/>} />
           <Route path="/chat/:touserId" element={<Chat/>} />
           <Route path="/alumni/:id" element={<AlumniProfilePage/>} />

           <Route path="/about" element={<About/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
  
  )
}

export default App
