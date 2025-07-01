import SignupPageUser from "./SignupPageUser"
 import { BrowserRouter,Routes,Route } from "react-router-dom"
 import Body from "./Body"
import Navbar from "./Navbar"
import Home from "./Home"
import Login from "./Login"
import SignupChoice from "./SignupChoice"

function App() {
  

  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body />}>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signupchoice" element={<SignupChoice/>} />
          <Route path="signupuser" element={<SignupPageUser />} />
        </Route>
      </Routes>
    </BrowserRouter>
  
  )
}

export default App
