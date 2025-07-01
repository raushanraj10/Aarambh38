import SignupPageUser from "./SignupPageUser"
 import { BrowserRouter,Routes,Route } from "react-router-dom"
 import Body from "./Body"

function App() {
  

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Body></Body>}/>
        <Route path="/signupuser" element={<SignupPageUser/>}/>
      </Routes>
    </BrowserRouter>
  
  )
}

export default App
