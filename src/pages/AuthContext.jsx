import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("feinime_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (userData) => {
    setUser(userData);
    localStorage.setItem("feinime_user", JSON.stringify(userData));

    try {
      await fetch("http://localhost:5000/api/save-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
    } catch (err) {
      console.error("Gagal simpan user ke server:", err);
    }
  };

  const logout = async () => {
    if (user?.google_id) {
      try {
        await fetch("http://localhost:5000/api/delete-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ google_id: user.google_id }),
        });
      } catch (err) {
        console.error("Gagal hapus user dari server:", err);
      }
    }

    setUser(null);
    localStorage.removeItem("feinime_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
