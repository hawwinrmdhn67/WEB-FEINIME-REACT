import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import anime3D from "../img/frieren.png"; // ganti dengan gambar anime 3D PNG-mu

const Home = () => {
  const fullText = "WELCOME TO FEINIME";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    let forward = true;
    let timeout;

    const type = () => {
      if (forward) {
        if (index < fullText.length) {
          index++;
          setDisplayedText(fullText.slice(0, index));
          timeout = setTimeout(type, 120);
        } else {
          forward = false;
          timeout = setTimeout(type, 1000);
        }
      } else {
        if (index > 0) {
          index--;
          setDisplayedText(fullText.slice(0, index));
          timeout = setTimeout(type, 50);
        } else {
          forward = true;
          timeout = setTimeout(type, 500);
        }
      }
    };

    type();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between px-6 sm:px-12 py-12 md:py-20 gap-8 md:gap-0">
      {/* Bagian Kiri - Text */}
      <motion.div
        className="text-center md:text-left max-w-xl"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {displayedText}
          <span className="animate-blink">|</span>
        </h1>

        <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-snug mb-6">
          Find a list of the best anime, save it to your favorites to watch later, and enjoy an exciting adventure in the world of anime!
        </p>

        {/* Tombol Navigasi */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
          <Link
            to="/topanime"
            className="px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold rounded-full shadow-md hover:scale-105 transform transition"
          >
            Top Anime
          </Link>
          <Link
            to="/animelist"
            className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-semibold rounded-full shadow-md hover:scale-105 transform transition"
          >
            Anime List
          </Link>
        </div>
      </motion.div>

      {/* Bagian Kanan - Gambar Anime 3D */}
      <motion.div
        className="flex justify-center md:justify-end"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <img
          src={anime3D}
          alt="Anime 3D"
          className="w-40 sm:w-60 md:w-96 drop-shadow-2xl"
        />
      </motion.div>
    </div>
  );
};

export default Home;
