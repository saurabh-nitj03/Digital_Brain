import Dashboard from "./pages/Dashboard"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import { BrowserRouter, Routes, Route, } from "react-router-dom"
import SecondBrainShare from "./pages/AllSharedBrain"
import Home from "./pages/Home"
import SharedBrain from "./pages/SharedBrain"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/shared-brains" element={<SecondBrainShare />}></Route>
        <Route path="/shared/:hash" element={<SharedBrain />}></Route>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App