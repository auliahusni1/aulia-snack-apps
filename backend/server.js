const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const dbPath = path.join(__dirname, "orders.db");
const db = new sqlite3.Database(dbPath);

// Buat tabel kalau belum ada
db.run(`
  CREATE TABLE IF NOT EXISTS pesanan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT,
    items TEXT,
    total INTEGER,
    waktu TEXT
  )
`);

// Endpoint penyimpanan
app.post("/api/pesan", (req, res) => {
  const { nama, items, total, waktu } = req.body;
  const stmt = db.prepare("INSERT INTO pesanan (nama, items, total, waktu) VALUES (?, ?, ?, ?)");
  stmt.run(nama, JSON.stringify(items), total, waktu, function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Gagal menyimpan pesanan" });
    }
    res.status(200).json({ message: "Pesanan berhasil disimpan!" });
  });
  stmt.finalize();
});

// Jalankan server
app.listen(port, () => {
  console.log(`Backend berjalan di http://localhost:${port}`);
});
