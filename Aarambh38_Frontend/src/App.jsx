import SignupPageUser from "./SignupPageUser"
 import { BrowserRouter,Routes,Route, RouterProvider } from "react-router-dom"
 import Body from "./Body"
import Navbar from "./Navbar"
import Home from "./Home"
import Login from "./Login"
import SignupChoice from "./SignupChoice"
import appStore from "./utils/appStore"
import { Provider } from 'react-redux'
import EmailVerification from "./EmailVerification"
import LandingPage from "./LandingPage"

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
        <Route path="/emailverification" element={<EmailVerification/>} />
          <Route path="signupuser" element={<SignupPageUser />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
  
  )
}

export default App
