import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

function AnimeList() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    const url = query
      ? `https://api.jikan.moe/v4/anime?q=${query}&limit=20`
      : `https://api.jikan.moe/v4/recommendations/anime`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setAnimes(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetch anime:", err);
        setLoading(false);
      });
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
  };

  return (
    <div className="px-4 sm:px-6 md:px-10">
      {/* Judul */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center"
      >
        Anime List
      </motion.h1>

      {/* Search Bar */}
      <motion.form
        onSubmit={handleSearch}
        className="flex justify-center mb-10 px-2 sm:px-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div whileHover={{ scale: 1.02 }} className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search anime..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-5 pr-14 py-3 rounded-full
             bg-gray-800 text-white placeholder-gray-400
             border-2 border-gray-700
             focus:border-transparent focus:ring-2 focus:ring-white
             shadow-lg text-base transition-all"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.9 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full
            bg-gradient-to-r from-blue-400 to-purple-500
            hover:from-blue-500 hover:to-purple-600
            text-white shadow-md transition-all"
          >
            <Search size={20} />
          </motion.button>
        </motion.div>
      </motion.form>

      {/* Loading */}
      {loading ? (
        <p className="text-center text-white mt-50">Loading...</p>
      ) : (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {animes.length > 0 ? (
            animes.map((item, index) => {
              const isRecommendation = !!item.entry;
              const image = isRecommendation
                ? item.entry[0]?.images.jpg.image_url
                : item.images.jpg.image_url;
              const title = isRecommendation ? item.entry[0]?.title : item.title;
              const subtitle = isRecommendation
                ? `Recommended with: ${item.entry[1]?.title || "N/A"}`
                : `Episodes: ${item.episodes || "?"}`;
              const animeId = isRecommendation ? item.entry[0].mal_id : item.mal_id;

              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 120 }}
                >
                  <Link
                    to={`/anime/${animeId}`}
                    className="bg-[#0f172a] rounded-xl shadow-md overflow-hidden flex flex-col h-full"
                  >
                    <img
                      src={image}
                      alt={title}
                      className="w-full aspect-[3/4] object-cover"
                    />
                    <div className="p-3 sm:p-4 flex flex-col flex-grow bg-[#1e293b]">
                    <h2 className="text-sm md:text-base font-bold text-white mb-1 line-clamp-2">
                      {title}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-400">
                      {subtitle}
                    </p>
                  </div>
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <p className="text-white text-center col-span-full">
              No results found
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default AnimeList;
