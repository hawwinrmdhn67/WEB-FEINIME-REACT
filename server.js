import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const CLIENT_ID = process.env.MAL_CLIENT_ID;

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQLDATABASE || "feinime",
  port: process.env.MYSQLPORT || 3306
});

app.use(cors());
app.use(express.json());

app.get("/api/anime", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.myanimelist.net/v2/anime/ranking?ranking_type=all&limit=50&fields=id,title,main_picture",
      { headers: { "X-MAL-CLIENT-ID": CLIENT_ID } }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Gagal fetch dari MAL" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetch MAL:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/anime/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(
      `https://api.myanimelist.net/v2/anime/${id}?fields=id,title,main_picture,synopsis,num_episodes,mean,status,genres`,
      { headers: { "X-MAL-CLIENT-ID": CLIENT_ID } }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Gagal fetch detail dari MAL" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetch detail MAL:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/save-user", async (req, res) => {
  const { google_id, name, email, picture } = req.body;  
  if (!google_id) return res.status(400).json({ error: "Google ID diperlukan!" });

  try {
    const conn = await pool.getConnection();
    await conn.query(
      `INSERT INTO users (google_id, name, email, picture) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
         name = VALUES(name), 
         email = VALUES(email),
         picture = VALUES(picture)`, 
      [google_id, name, email, picture]
    );
    conn.release();

    res.json({ message: "User disimpan/diupdate!", user: { google_id, name, email, picture } });
  } catch (err) {
    console.error("Error save user:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query("SELECT * FROM users");
    conn.release();

    res.json(rows);
  } catch (err) {
    console.error("Error get users:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/favorites", async (req, res) => {
  const { google_id, anime_id, title, image_url } = req.body;
  if (!google_id) return res.status(400).json({ error: "Login diperlukan!" });

  try {
    const conn = await pool.getConnection();
    await conn.query(
      `INSERT INTO favorites (google_id, anime_id, title, image_url) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
         title = VALUES(title), 
         image_url = VALUES(image_url)`,
      [google_id, anime_id, title, image_url]
    );
    conn.release();

    res.json({ message: "Anime ditambahkan ke favorit!" });
  } catch (err) {
    console.error("Error tambah favorit:", err);
    res.status(500).json({ error: "Gagal simpan favorit" });
  }
});

app.delete("/api/favorites", async (req, res) => {
  const { google_id, anime_id } = req.body;
  if (!google_id) return res.status(400).json({ error: "Login diperlukan!" });

  try {
    const conn = await pool.getConnection();
    await conn.query(
      "DELETE FROM favorites WHERE google_id = ? AND anime_id = ?",
      [google_id, anime_id]
    );
    conn.release();

    res.json({ message: "Anime dihapus dari favorit!" });
  } catch (err) {
    console.error("Error hapus favorit:", err);
    res.status(500).json({ error: "Gagal hapus favorit" });
  }
});

app.get("/api/favorites/:google_id", async (req, res) => {
  const { google_id } = req.params;

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      "SELECT * FROM favorites WHERE google_id = ?",
      [google_id]
    );
    conn.release();

    res.json(rows);
  } catch (err) {
    console.error("Error get favorit:", err);
    res.status(500).json({ error: "Gagal ambil data favorit" });
  }
});

app.use(express.static(path.join(__dirname, "dist")));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
