const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors({
  origin: "*", // supaya bisa diakses dari file:// atau live server
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(bodyParser.json());

const dbPath = path.join(__dirname, "orders.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Gagal koneksi database:", err.message);
  } else {
    console.log("Tersambung ke database SQLite");
    db.run(`
      CREATE TABLE IF NOT EXISTS pesanan (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT,
        items TEXT,
        total INTEGER,
        waktu TEXT
      )
    `);
  }
});

app.post("/api/pesan", (req, res) => {
  const { nama, items, total, waktu } = req.body;
  const query = `INSERT INTO pesanan (nama, items, total, waktu) VALUES (?, ?, ?, ?)`;
  db.run(query, [nama, JSON.stringify(items), total, waktu], (err) => {
    if (err) {
      console.error("Gagal menyimpan ke database:", err.message);
      res.status(500).json({ error: "Gagal menyimpan ke database" });
    } else {
      res.json({ message: "Pesanan berhasil disimpan" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
