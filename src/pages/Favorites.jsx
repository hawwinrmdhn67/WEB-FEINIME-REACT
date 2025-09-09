import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";
import { useAuth } from "../pages/AuthContext";

function FavoriteList() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return setLoading(false);

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

  const showSwal = (type, title, text, timer = 0) => {
    Swal.fire({
      icon: type,
      title,
      text,
      confirmButtonColor: type === "success" ? "#8B5CF6" : "#EF4444",
      background: "#1F2937",
      color: "#fff",
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" },
      timer: timer || undefined,
      showConfirmButton: timer ? false : true,
    });
  };

  const removeFavorite = async (animeId) => {
    if (!user) return;

    setUpdating(true);
    const prevList = [...favorites];
    setFavorites(favorites.filter((a) => a.anime_id !== animeId));

    try {
      const res = await fetch("http://localhost:5000/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ google_id: user.google_id, anime_id: animeId }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      showSwal("success", "Berhasil Dihapus!", "Anime berhasil dihapus dari favorit.", 1500);
    } catch (err) {
      console.error("Gagal hapus favorit:", err);
      setFavorites(prevList);
      showSwal("error", "Gagal", "Gagal hapus favorit. Silakan coba lagi.");
    } finally {
      setUpdating(false);
    }
  };

  if (!user)
    return <p className="text-center mt-50 text-white">Silakan login untuk melihat list anime favoritemu.</p>;
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
    <div className="px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center"
      >
        Daftar Anime Favorit
      </motion.h1>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        <AnimatePresence>
          {favorites.map((anime) => (
            <motion.div
              key={anime.anime_id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 120 }}
              layout
            >
              <Link
                to={`/anime/${anime.anime_id}`}
                className="bg-[#0f172a] rounded-xl shadow-md overflow-hidden flex flex-col h-full"
              >
                <img
                  src={anime.image_url}
                  alt={anime.title}
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="p-3 sm:p-4 flex flex-col flex-grow bg-[#1e293b]">
                  <h2 className="text-sm md:text-base font-bold text-white mb-1 line-clamp-2">
                    {anime.title}
                  </h2>
                  <div className="mt-auto flex justify-end">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFavorite(anime.anime_id);
                      }}
                      disabled={updating}
                      className="px-3 py-1 rounded-full text-white bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default FavoriteList;
