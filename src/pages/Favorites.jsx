// src/components/FavoriteList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../pages/AuthContext"; // sesuaikan path

function FavoriteList() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Fetch favorit user
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return setLoading(false); // kalau belum login, skip

      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/favorites/${user.google_id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error("Gagal fetch favorit:", err);
        setError("Gagal ambil data favorit. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  // Hapus favorit
  const removeFavorite = async (animeId) => {
    if (!user) return;

    setUpdating(true);
    const prevList = [...favorites];
    setFavorites(favorites.filter((a) => a.anime_id !== animeId)); // optimistik update

    try {
      const res = await fetch("http://localhost:5000/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ google_id: user.google_id, anime_id: animeId }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      console.error("Gagal hapus favorit:", err);
      setFavorites(prevList); // rollback
      alert("Gagal hapus favorit. Silakan coba lagi.");
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return <p className="text-center mt-50 text-white">Silakan login untuk melihat list anime favoritemu.</p>;
  if (loading) return <p className="text-center mt-50 text-white">Loading...</p>;
  if (error) return <p className="text-center mt-50 text-red-400">{error}</p>;
  if (favorites.length === 0)
    return (
      <div className="text-center text-gray-400 mt-50">
        <p className="mb-4">Belum ada anime favorit.</p>
        <Link
          to="/"
          className="px-5 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold rounded-full shadow-md hover:from-blue-500 hover:to-purple-500 transition text-sm sm:text-base"
        >
          Kembali ke Home
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center">
        Daftar Anime Favorit
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {favorites.map((anime) => (
          <div
            key={anime.anime_id}
            className="flex flex-col bg-[#0f172a] rounded-xl shadow-md overflow-hidden hover:scale-105 transform transition duration-300 cursor-pointer"
          >
            <Link to={`/anime/${anime.anime_id}`} className="w-full aspect-[3/4] relative">
              <img
                src={anime.image_url}
                alt={anime.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </Link>
            <div className="flex flex-col flex-grow p-3 sm:p-4 bg-[#1e293b]">
              <h3
                className="text-white font-semibold text-sm sm:text-base mb-2 truncate line-clamp-2"
                title={anime.title}
              >
                {anime.title}
              </h3>
              <div className="mt-auto flex justify-end">
                <button
                  onClick={() => removeFavorite(anime.anime_id)}
                  disabled={updating}
                  className="px-3 py-1 rounded-full text-white bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoriteList;
