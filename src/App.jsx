import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import TopAnime from "./pages/TopAnime";
import AnimeList from "./pages/AnimeList";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import AnimeDetail from "./pages/AnimeDetail";
import { AuthProvider } from "./pages/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
          <Navbar />
          <div className="container mx-auto px-6 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/topanime" element={<TopAnime />} />
              <Route path="/animelist" element={<AnimeList />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/login" element={<Login />} />
              <Route path="/anime/:id" element={<AnimeDetail />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
