import Dashboard from "./pages/Dashboard"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import SecondBrainShare from "./pages/AllSharedBrain"
import Home from "./pages/Home"
import SharedBrain from "./pages/SharedBrain"
import ChatWithContent from "./components/ChatWithContent"

// Component to conditionally show chat based on route
const ChatWrapper = () => {
  const location = useLocation();
  const isAuthenticatedRoute = ['/dashboard', '/shared-brains'].includes(location.pathname);
  
  return isAuthenticatedRoute ? <ChatWithContent /> : null;
};

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
      <ChatWrapper />
    </BrowserRouter>
  )
}

export default App