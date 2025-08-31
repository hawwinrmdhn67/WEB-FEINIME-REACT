import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center">
        Top Anime
      </h2>

      {currentAnime.length === 0 ? (
        <p className="text-center text-gray-400">Tidak ada data top anime</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {currentAnime.map(({ node, ranking }) => (
              <Link
                key={node.id}
                to={`/anime/${node.id}`}
                className="flex flex-col bg-[#0f172a] rounded-xl shadow-md overflow-hidden hover:scale-105 transform transition duration-300 cursor-pointer"
              >
                <div className="w-full aspect-[3/4] relative">
                  <img
                    src={node.main_picture?.medium}
                    alt={node.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
                  />
                </div>
                <div className="flex flex-col flex-grow p-4 bg-[#1e293b] min-h-[80px]">
                  <h3 className="text-white font-semibold text-sm sm:text-base mb-2 line-clamp-2">
                    {node.title}
                  </h3>
                  <div className="mt-auto text-gray-400 text-xs sm:text-sm">
                    Rank: <span className="text-white">{ranking?.rank ?? "-"}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TopAnime;
