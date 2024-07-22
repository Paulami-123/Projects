import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { About } from "./pages/About"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Header from "./components/Header"
import FooterCom from "./components/Footer"
import PrivateRoutes from "./components/PrivateRoutes"
import OnlyAdminPrivateRoutes from "./components/OnlyAdminPrivateRoutes"
import CreatePost from "./pages/CreatePost"
import UpdatePost from "./pages/UpdatePost"

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route element={<PrivateRoutes />} >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoutes />}>
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/updatepost/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/projects" element={<Projects />} />
      </Routes>
    <FooterCom />
    </BrowserRouter>
  )
}

export default App