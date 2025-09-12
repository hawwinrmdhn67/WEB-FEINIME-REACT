import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthContext";
import { User, Lock, Heart, Bell, Settings as Cog } from "lucide-react";
import FavoriteList from "./Favorites";

function Settings() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // State Profile
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photo, setPhoto] = useState(null);

  // State Password
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  // State Notifications
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);

  // Dummy Favorites
  const favorites = [
    { id: 1, title: "Artikel React" },
    { id: 2, title: "Tutorial PHP" },
    { id: 3, title: "Belajar TailwindCSS" },
  ];

  const handlePhotoChange = (e) => setPhoto(e.target.files[0]);

  const handleUpdate = async () => {
    await updateProfile({ name, email, photo });
    alert("Profile updated!");
  };

  const handlePasswordSave = () => {
    if (newPw !== confirmPw) {
      alert("Password baru tidak sama!");
      return;
    }
    alert("Password berhasil diubah!");
  };

  const handleNotifSave = () => {
    alert("Pengaturan notifikasi tersimpan!");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Yakin ingin menghapus akun?")) {
      alert("Akun dihapus.");
    }
  };

  const tabs = [
    { key: "profile", label: "Profile", icon: <User size={20} /> },
    { key: "password", label: "Password", icon: <Lock size={20} /> },
    { key: "favorites", label: "Favorites", icon: <Heart size={20} /> },
    { key: "notifications", label: "Notifications", icon: <Bell size={20} /> },
    { key: "account", label: "Account", icon: <Cog size={20} /> },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row items-start justify-center md:justify-between px-4 sm:px-8 py-8 md:py-20 gap-6 md:gap-0">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 border-r border-gray-800 p-6 flex-col gap-5">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          ⚙︎ Settings
        </h1>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium text-base
              ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto min-h-[60vh] sm:min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* Profile */}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-semibold">Profile Settings</h2>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Profile Photo</label>
                <input
                  type="file"
                  onChange={handlePhotoChange}
                  className="mt-1 block w-full text-sm text-gray-300 file:mr-3 file:py-2 file:px-3
                  file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-blue-400 file:to-purple-400 file:text-white hover:file:opacity-90 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-5 pr-14 py-3 rounded-full bg-gray-800 text-white border-2 border-gray-700 focus:ring-2 focus:ring-white shadow-lg transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-5 pr-14 py-3 rounded-full bg-gray-800 text-white border-2 border-gray-700 focus:ring-2 focus:ring-white shadow-lg transition-all"
                />
              </div>

              <button
                onClick={handleUpdate}
                className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-lg shadow hover:opacity-90 transition"
              >
                Update Profile
              </button>
            </motion.div>
          )}

          {/* Password */}
          {activeTab === "password" && (
            <motion.div
              key="password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-semibold">Change Password</h2>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className="w-full pl-5 pr-14 py-3 rounded-full bg-gray-800 text-white border-2 border-gray-700 focus:ring-2 focus:ring-white shadow-lg transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className="w-full pl-5 pr-14 py-3 rounded-full bg-gray-800 text-white border-2 border-gray-700 focus:ring-2 focus:ring-white shadow-lg transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className="w-full pl-5 pr-14 py-3 rounded-full bg-gray-800 text-white border-2 border-gray-700 focus:ring-2 focus:ring-white shadow-lg transition-all"
                />
              </div>

              <button
                onClick={handlePasswordSave}
                className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-lg shadow hover:opacity-90 transition"
              >
                Save Password
              </button>
            </motion.div>
          )}

          {/* Favorites */}
          {activeTab === "favorites" && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-semibold">Your Favorites</h2>
              {/* kalau kosong */}
              {(!user.favorites || user.favorites.length === 0) ? (
              <div className="flex items-center justify-center min-h-[40vh]">
                <div className="text-center text-gray-400">
                  <p className="text-base">You haven't added any favorite anime yet.</p>
                  <p className="text-sm mt-2">Add from anime list page!</p>
                </div>
              </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {user.favorites.map((anime) => (
                    <div
                      key={anime.id}
                      className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                    >
                      <img
                        src={anime.image}
                        alt={anime.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-white truncate">
                          {anime.title}
                        </h3>
                        <button className="mt-2 text-xs text-red-400 hover:underline">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-semibold">Notification Settings</h2>

              <label className="flex items-center gap-2 bg-gray-800 p-3 rounded-lg border-2 border-gray-700 shadow-lg">
                <input
                  type="checkbox"
                  checked={notifEmail}
                  onChange={() => setNotifEmail(!notifEmail)}
                />
                Email Notifications
              </label>

              <label className="flex items-center gap-2 bg-gray-800 p-3 rounded-lg border-2 border-gray-700 shadow-lg">
                <input
                  type="checkbox"
                  checked={notifPush}
                  onChange={() => setNotifPush(!notifPush)}
                />
                Push Notifications
              </label>

              <button
                onClick={handleNotifSave}
                className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-lg shadow hover:opacity-90 transition"
              >
                Save Notifications
              </button>
            </motion.div>
          )}

          {/* Account */}
          {activeTab === "account" && (
            <motion.div
              key="account"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-semibold">Account Settings</h2>

              <div className="p-4 rounded-lg bg-gray-800 border-2 border-gray-700 shadow-lg">
                <p>Email connected: <span className="text-gray-300">{user?.email}</span></p>
              </div>

              <div className="flex gap-3">
              <button className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-lg shadow hover:opacity-90 transition">
                Logout
              </button>
              <button className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-red-700 to-red-700 text-white rounded-lg shadow hover:opacity-90 transition">
                Delete Account
              </button>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Tab bar Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around items-center py-2 md:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg transition text-xs
              ${
                activeTab === tab.key
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
          >
            <div
              className={`p-2 rounded-lg ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-blue-400 to-purple-400 text-white"
                  : ""
              }`}
            >
              {tab.icon}
            </div>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Settings;
