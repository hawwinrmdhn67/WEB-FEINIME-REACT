import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { useAuth } from './AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    const userData = {
      google_id: decoded.sub, 
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture
    };

    login(userData);
    localStorage.setItem("feinime_user", JSON.stringify(userData));

    fetch("http://localhost:5000/api/save-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    })
      .then(res => res.json())
      .then(data => console.log("User saved:", data))
      .catch(err => console.error("Error saving user:", err));

    Swal.fire({
      icon: 'success',
      title: `Selamat Datang, ${decoded.name}!`,
      text: 'Login berhasil dengan Google.',
      confirmButtonColor: '#8B5CF6',
      background: '#1F2937',
      color: '#fff',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then(() => {
      navigate('/');
    });
  };

  const handleError = () => {
    Swal.fire({
      icon: 'error',
      title: 'Login Gagal',
      text: 'Silakan coba lagi!',
      confirmButtonColor: '#EF4444',
      background: '#1F2937',
      color: '#fff'
    });
  };

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6 py-25 text-center">
      <motion.div
        className="bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg w-full max-w-sm sm:max-w-md"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="flex items-center justify-center text-xl sm:text-2xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            @FeiNime
          </span>
          <motion.img
            src="https://media.tenor.com/rC-qGPAySz4AAAAi/anime-girl.gif"
            alt="Logo GIF"
            className="w-6 h-6 sm:w-8 sm:h-8 ml-2"
            whileHover={{ rotate: 8, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
        </motion.h2>

        {/* Form Login manual */}
        <motion.form
          className="mt-6 space-y-4 text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div>
            <label className="block text-gray-300 mb-1 text-sm sm:text-base text-left">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-white outline-none text-sm sm:text-base"
              placeholder="Email or username"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1 text-sm sm:text-base text-left">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-white outline-none text-sm sm:text-base"
              placeholder="Password"
            />
          </div>

          <motion.button
            type="submit"
            className="w-full py-2 rounded-lg shadow-md transition font-semibold text-sm sm:text-base bg-gradient-to-r from-blue-400 to-purple-400 text-white hover:opacity-90"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </motion.form>

        {/* Google Login */}
        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
