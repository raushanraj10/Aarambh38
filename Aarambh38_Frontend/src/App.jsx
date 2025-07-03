import SignupPageUser from "./SignupPageUser"
 import { BrowserRouter,Routes,Route, RouterProvider } from "react-router-dom"
 import Body from "./Body"
import Navbar from "./Navbar"
import Home from "./Home"
import Login from "./Login"
import SignupChoice from "./SignupChoice"
import appStore from "./utils/appStore"
import { Provider } from 'react-redux'
import LandingPage from "./LandingPage"
import SignupPageAlumini from "./SignupPageAlumini"
import EmailVerificationUser from "./EmailverifictionUser"
import EmailVerificationAlumini from "./EmailVerificationAlumini"

function App() {
  

  return (
    <Provider store={appStore}>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body />}>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/landingpage" element={<LandingPage/>}/>
        <Route path="/signupchoice" element={<SignupChoice/>} />
        <Route path="/emailverificationuser" element={<EmailVerificationUser/>} />
        <Route path="/emailverificationalumini" element={<EmailVerificationAlumini/>} />
          <Route path="/signupuser" element={<SignupPageUser />} />
           <Route path="/signupalumini" element={<SignupPageAlumini/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
  
  )
}

export default App
