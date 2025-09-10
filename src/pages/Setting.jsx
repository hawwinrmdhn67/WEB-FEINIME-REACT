import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthContext";

function Settings() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => setPhoto(e.target.files[0]);

  const handleUpdate = async () => {
    await updateProfile({ name, email, photo });
    alert("Profile updated!");
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-start justify-center md:justify-between px-6 sm:px-12 py-12 md:py-20 gap-8 md:gap-0">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-800 p-4 sm:p-6 flex flex-row md:flex-col gap-3 md:gap-5 overflow-x-auto md:overflow-visible">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent whitespace-nowrap">
          ⚙︎ Settings
        </h1>
        {["profile", "password", "favorites", "notifications", "account"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap transition font-medium text-sm sm:text-base ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-semibold">
                Profile Settings
              </h2>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Profile Photo
                </label>
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
                  className="w-full pl-5 pr-14 py-3 rounded-full 
                             bg-gray-800 text-white placeholder-gray-400
                             border-2 border-gray-700
                             focus:border-transparent focus:ring-2 focus:ring-white
                             shadow-lg text-base transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-5 pr-14 py-3 rounded-full 
                             bg-gray-800 text-white placeholder-gray-400
                             border-2 border-gray-700
                             focus:border-transparent focus:ring-2 focus:ring-white
                             shadow-lg text-base transition-all"
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

          {activeTab === "password" && (
            <motion.div
              key="password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-semibold">
                Change Password
              </h2>
              <input
                type="password"
                placeholder="New Password"
                className="w-full pl-5 pr-14 py-3 rounded-full 
                           bg-gray-800 text-white placeholder-gray-400
                           border-2 border-gray-700
                           focus:border-transparent focus:ring-2 focus:ring-white
                           shadow-lg text-base transition-all"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full pl-5 pr-14 py-3 rounded-full 
                           bg-gray-800 text-white placeholder-gray-400
                           border-2 border-gray-700
                           focus:border-transparent focus:ring-2 focus:ring-white
                           shadow-lg text-base transition-all"
              />
              <button className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-lg shadow hover:opacity-90 transition">
                Update Password
              </button>
            </motion.div>
          )}

          {activeTab === "favorites" && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-semibold">
                Favorites Settings
              </h2>
              <label className="flex items-center gap-2 mb-6">
                <input type="checkbox" className="accent-purple-500" /> Make my
                favorites public
              </label>
              <button className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-lg shadow hover:opacity-90 transition">
                Clear All Favorites
              </button>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-semibold">
                Notification Preferences
              </h2>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-purple-500" /> Notify
                me when a new anime is added
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-purple-500" /> Notify
                me when my favorite anime updates
              </label>
            </motion.div>
          )}

          {activeTab === "account" && (
            <motion.div
              key="account"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                Detail Account
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-lg shadow hover:opacity-90 transition">
                  Delete Account
                </button>
                <button className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-lg shadow hover:opacity-90 transition">
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Settings;
