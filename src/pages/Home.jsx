import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bannerImg from "../img/wujudaseliadmin.jpg";

const Home = () => {
  const fullText = "SELAMAT DATANG DI FEINIME";
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
    <div className="w-full flex flex-col items-center px-4 sm:px-6 py-10 text-center">
      {/* Judul dengan typewriter */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {displayedText}
        <span className="animate-blink">|</span>
      </h1>

      {/* Foto Bulat */}
      <img
        src={bannerImg}
        alt="Anime Banner"
        className="w-28 sm:w-32 md:w-40 rounded-full shadow-lg border-2 border-white mb-1"
      />
      <p className="text-white text-xs sm:text-sm md:text-base font-medium mb-2">
        WUJUD ASELI ADMIN
      </p>

      {/* Deskripsi */}
      <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-xl sm:max-w-2xl text-center leading-snug mb-3">
        Temukan daftar anime terbaik, simpan ke dalam favoritmu untuk ditonton nanti, 
        dan nikmati petualangan seru di dunia anime!
      </p>

      {/* Tombol Navigasi */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Link
          to="/topanime"
          className="px-5 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold rounded-full shadow-md hover:from-blue-500 hover:to-purple-500 transition text-sm sm:text-base"
        >
          Top Anime
        </Link>
        <Link
          to="/animelist"
          className="px-5 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-semibold rounded-full shadow-md hover:from-purple-500 hover:to-pink-500 transition text-sm sm:text-base"
        >
          Anime List
        </Link>
      </div>
    </div>
  );
};

export default Home;
