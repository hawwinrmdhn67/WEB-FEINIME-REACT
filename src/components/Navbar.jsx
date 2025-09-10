import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Home, Star, List, Heart, LogIn } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../pages/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Klik di luar dropdown menutup dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target)) &&
        (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target))
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setIsOpen(false);

    Swal.fire({
      icon: "success",
      title: "Logout Berhasil",
      text: "Good Bye @FeiNime!",
      confirmButtonColor: "#8B5CF6",
      background: "#1F2937",
      color: "#fff",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    }).then(async () => {
      await logout();
      navigate("/");
    });
  };

  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Top Anime", path: "/topanime", icon: <Star size={20} /> },
    { name: "Anime List", path: "/animelist", icon: <List size={20} /> },
    { name: "Favorites", path: "/favorites", icon: <Heart size={20} /> },
  ];

  return (
    <nav className="sticky top-0 z-50">
      {/* Blur navbar */}
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-md shadow-lg pointer-events-none"></div>

      <div className="relative container mx-auto flex justify-between items-center py-4 px-6 z-10">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          <img src="/logofeinime.png" alt="Logo" className="w-8 h-8 object-contain" />
          FeiNime
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center items-center space-x-6">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "text-indigo-400 font-semibold" : "hover:text-indigo-300"
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Login / Avatar Desktop */}
        <div className="hidden md:flex items-center ml-auto relative" ref={desktopDropdownRef}>
          {!user ? (
            <NavLink
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-blue-400 to-purple-400 hover:from-purple-400 hover:to-blue-400"
            >
              <LogIn size={18} />
              Login
            </NavLink>
          ) : (
            <>
              <img
                src={user.picture || "https://i.pravatar.cc/100"}
                alt={user.name || "User"}
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={toggleDropdown}
              />
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden z-20"
                  >
                    <div className="px-4 py-3 border-b border-gray-700 flex items-center gap-3">
                      <img
                        src={user.picture || "https://i.pravatar.cc/100"}
                        alt={user.name || "User"}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">{user.name}</span>
                        <span className="text-xs text-gray-400">{user.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setDropdownOpen(false); // tutup dropdown
                        navigate("/setting"); // pindah halaman
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 hover:text-white transition-colors duration-200"
                    >
                      Setting
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 hover:text-white transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2 relative" ref={mobileDropdownRef}>
          {user && (
            <img
              src={user.picture || "https://i.pravatar.cc/100"}
              alt={user.name || "User"}
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={toggleDropdown}
            />
          )}
          <button
            className="text-white p-2 rounded-full hover:text-indigo-400 hover:bg-gray-800 transition-colors duration-300"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Mobile Dropdown Avatar */}
          <AnimatePresence>
            {dropdownOpen && user && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-16 right-0 w-56 bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden z-20"
              >
                <div className="px-4 py-3 border-b border-gray-700 flex items-center gap-3">
                  <img
                    src={user.picture || "https://i.pravatar.cc/100"}
                    alt={user.name || "User"}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">{user.name}</span>
                    <span className="text-xs text-gray-400">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                  setDropdownOpen(false); // tutup dropdown
                  navigate("/setting"); // pindah halaman
                     }}
                    className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 hover:text-white transition-colors duration-200"
                    >
                  Setting
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 hover:text-white transition-colors duration-200"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Developed By Hawwin
          </h1>
          <button onClick={toggleMenu} className="text-white">
            <X size={28} />
          </button>
        </div>

        <nav className="flex flex-col px-6 py-6 space-y-4">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={toggleMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-white shadow-sm transition duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-400 to-purple-400 font-semibold"
                    : "bg-gray-700 hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}

          {!user && (
            <NavLink
              to="/login"
              onClick={toggleMenu}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-white bg-gray-700 hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 transition-colors duration-300"
            >
              <LogIn size={18} />
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </nav>
  );
}

export default Navbar;
