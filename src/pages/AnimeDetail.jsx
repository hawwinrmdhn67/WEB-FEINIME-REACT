import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../pages/AuthContext"; 
import Swal from "sweetalert2";
import { motion } from "framer-motion";

function AnimeDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [anime, setAnime] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingAnime, setLoadingAnime] = useState(true);
  const [loadingFav, setLoadingFav] = useState(true);
  const [updatingFav, setUpdatingFav] = useState(false);

  const formatStatus = (status) => {
    if (!status) return "?";
    return status
      .split("_")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/anime/${id}`);
        const data = await res.json();
        setAnime(data);
      } catch (err) {
        console.error("Gagal fetch detail anime:", err);
      } finally {
        setLoadingAnime(false);
      }
    };
    fetchAnime();
  }, [id]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) return setLoadingFav(false);

      try {
        const res = await fetch(`http://localhost:5000/api/favorites/${user.google_id}`);
        const favorites = await res.json();
        setIsFavorite(favorites.some(fav => parseInt(fav.anime_id) === parseInt(id)));
      } catch (err) {
        console.error("Gagal cek favorit:", err);
      } finally {
        setLoadingFav(false);
      }
    };

    checkFavorite();
  }, [id, user]);

  const handleFavorite = async () => {
  // If no user is logged in, show a SweetAlert error and exit.
  if (!user) {
    Swal.fire({
      icon: 'error',
      title: 'Login Dulu!',
      text: 'Silakan login dulu untuk menambahkan anime ke favorit.',
      confirmButtonColor: '#8B5CF6',
      background: '#1F2937',
      color: '#fff',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
    return;
  }

  // If no anime data exists, exit the function.
  if (!anime) return;

  // Set the state to indicate the favorite status is being updated.
  setUpdatingFav(true);

  try {
    // Determine the anime ID, using 'id' first, then 'mal_id' as a fallback.
    const animeId = anime.id || anime.mal_id;
    let method;
    let body;
    let successMessage;
    let successTitle;

    // Check if the anime is already a favorite.
    if (isFavorite) {
      // If it is a favorite, prepare for a DELETE request.
      method = "DELETE";
      body = JSON.stringify({
        google_id: user.google_id,
        anime_id: animeId
      });
      successTitle = 'Berhasil Dihapus!';
      successMessage = `${anime.title} sudah dihapus dari favorit.`;
    } else {
      // If it's not a favorite, prepare for a POST request.
      method = "POST";
      body = JSON.stringify({
        google_id: user.google_id,
        anime_id: animeId,
        title: anime.title,
        image_url: anime.main_picture?.large || anime.main_picture?.medium || "",
      });
      successTitle = 'Berhasil Ditambahkan!';
      successMessage = `${anime.title} sudah ditambahkan ke favorit.`;
    }

    // Send the request to the server.
    await fetch("http://localhost:5000/api/favorites", {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body,
    });

    // Toggle the favorite status in the state.
    setIsFavorite(!isFavorite);

    // Show a success notification.
    Swal.fire({
      icon: 'success',
      title: successTitle,
      text: successMessage,
      confirmButtonColor: '#8B5CF6',
      background: '#1F2937',
      color: '#fff',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      timer: 2000,
      showConfirmButton: false
    });
  } catch (err) {
    // If an error occurs, log it and show an error notification.
    console.error("Gagal update favorit:", err);
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Terjadi kesalahan. Silakan coba lagi.',
      confirmButtonColor: '#EF4444',
      background: '#1F2937',
      color: '#fff',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
  } finally {
    // Always reset the updating state, regardless of success or failure.
    setUpdatingFav(false);
  }
};

  if (loadingAnime) return <p className="text-center text-gray-400 mt-50">Loading...</p>;
  if (!anime) return <p className="text-center text-red-400 mt-50">Anime tidak ditemukan.</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}   // konsisten dengan AnimeList & TopAnime
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col md:flex-row p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg max-w-5xl mx-auto"
    >
      {/* Poster */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="flex-shrink-0 mx-auto md:mx-0"
      >
        <img
          src={anime.main_picture?.large || anime.main_picture?.medium}
          alt={anime.title}
          className="rounded-lg shadow-lg w-48 md:w-56 lg:w-60"
        />
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="flex-1 mt-6 md:mt-0 md:ml-10 self-start pr-2 sm:pr-4 md:pr-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {anime.title}
        </h1>

        {/* Tombol Favorite */}
        <motion.button
          onClick={handleFavorite}
          whileHover={{ scale: updatingFav || loadingFav ? 1 : 1.05 }}
          whileTap={{ scale: updatingFav || loadingFav ? 1 : 0.95 }}
          className={`mb-4 px-4 py-2 rounded-full font-semibold transition-all border border-white ${
            loadingFav || updatingFav
              ? "bg-gray-500 text-gray-300 cursor-wait"
              : "bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent cursor-pointer"
          }`}
        >
          {loadingFav
            ? "Cek favorit..."
            : updatingFav
            ? isFavorite
              ? "Menghapus..."
              : "Menambahkan..."
            : isFavorite
            ? "❤️ Favorited"
            : "🤍 Add to Favorite"}
        </motion.button>

        {/* Info singkat */}
        <div className="flex flex-wrap gap-4 text-gray-300 mb-3 text-sm md:text-base">
          <p>
            <span className="font-semibold">Episodes:</span>{" "}
            {anime.num_episodes || "?"}
          </p>
          <p>
            <span className="font-semibold">Score:</span> ⭐ {anime.mean || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {formatStatus(anime.status)}
          </p>
        </div>

        {/* Genre */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="flex flex-wrap gap-2 mb-4"
        >
          {anime.genres?.map((genre) => (
            <motion.span
              key={genre.id}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs md:text-sm"
            >
              {genre.name}
            </motion.span>
          ))}
        </motion.div>

        {/* Deskripsi */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-gray-200 leading-relaxed text-sm md:text-base text-justify"
        >
          {anime.synopsis}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default AnimeDetail;
