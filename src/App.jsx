import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CreateProfile from "./pages/CreateProfile";
import Interests from "./pages/Interests";
import Matches from "./pages/Matches";
function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/matches" element={<Matches />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/chat/:id" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;