import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {

  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  )
}

export default App
