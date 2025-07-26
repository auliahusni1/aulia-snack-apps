const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(cors());
app.use(express.json());

// Buat koneksi database
const db = new sqlite3.Database('./orders.db');

// Pastikan tabel memiliki kolom waktu
db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT,
    items TEXT,
    total INTEGER,
    waktu TEXT
  )
`);

// Endpoint untuk menerima data pesanan
app.post('/api/order', (req, res) => {
  const { nama, items, total, waktu } = req.body;

  if (!nama || !items || !total || !waktu) {
    return res.status(400).json({ error: 'Data tidak lengkap' });
  }

  const stmt = db.prepare("INSERT INTO orders (nama, items, total, waktu) VALUES (?, ?, ?, ?)");
  stmt.run(nama, JSON.stringify(items), total, waktu, function (err) {
    if (err) return res.status(500).json({ error: 'Gagal menyimpan ke database' });
    res.status(201).json({ message: 'Pesanan berhasil disimpan!', id: this.lastID });
  });
});

// Jalankan server
app.listen(3000, () => console.log('Server berjalan di http://localhost:3000'));
