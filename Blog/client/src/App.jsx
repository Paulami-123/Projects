import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { About } from "./pages/About"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Dashboard from "./pages/Dashboard"
import Header from "./components/Header"
import FooterCom from "./components/Footer"
import PrivateRoutes from "./components/PrivateRoutes"
import CreatePost from "./pages/CreatePost"
import UpdatePost from "./pages/UpdatePost"
import PostPage from "./pages/PostPage"
import Search from "./pages/Search"
import ScrollToTop from "./components/ScrollToTop"

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateRoutes />} >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/updatepost/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/post/:postslug" element={<PostPage />} />
      </Routes>
    <FooterCom />
    </BrowserRouter>
  )
}

export default App