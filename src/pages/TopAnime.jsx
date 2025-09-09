import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const TopAnime = () => {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("http://localhost:5000/api/anime?limit=50")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal ambil data ranking dari server");
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setAnime(data.data);
        } else {
          setAnime([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAnime = anime.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(anime.length / itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading)
    return <p className="text-center text-gray-300 mt-50">Loading...</p>;
  if (error)
    return <p className="text-center text-red-400 mt-50">{error}</p>;

  return (
    <div className="px-4 sm:px-6 md:px-10">
      {/* Judul */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center"
      >
        Top Anime
      </motion.h2>

      {currentAnime.length === 0 ? (
        <p className="text-center text-gray-400">Tidak ada data top anime</p>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08, // lebih smooth cascade
                  },
                },
              }}
            >
              {currentAnime.map(({ node, ranking }, index) => (
                <motion.div
                  key={node.id}
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.95 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 180,
                        damping: 18,
                      },
                    },
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 8px 24px rgba(0,0,0,0.3)",
                    transition: { duration: 0.25, ease: "easeOut" }, // hover lebih smooth
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to={`/anime/${node.id}`}
                    className="bg-[#0f172a] rounded-xl shadow-md overflow-hidden flex flex-col h-full"
                  >
                    <img
                      src={node.main_picture?.medium}
                      alt={node.title}
                      className="w-full aspect-[3/4] object-cover"
                    />
                    <div className="p-3 sm:p-4 flex flex-col flex-grow bg-[#1e293b]">
                      <h3 className="text-white font-semibold text-sm sm:text-base mb-1 line-clamp-2">
                        {node.title}
                      </h3>
                      <div className="text-gray-400 text-xs sm:text-sm mt-auto">
                        Rank:{" "}
                        <span className="text-white">
                          {ranking?.rank ?? "-"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <motion.button
              onClick={handlePrev}
              disabled={currentPage === 1}
              whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.9 }}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Prev
            </motion.button>

            <span className="text-white font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <motion.button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.9 }}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
};

export default TopAnime;
