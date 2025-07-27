document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const namaInput = document.getElementById("nama");
  const totalItemEls = document.querySelectorAll(".totalItem");
  const jumlahInputs = document.querySelectorAll('input[type="number"]');
  const info = document.getElementById("info");
  const waktuPesanan = document.getElementById("waktuPesanan");
  const totalKeseluruhan = document.getElementById("totalKeseluruhan");
  const tombolPesanLagi = document.getElementById("pesanLagi");

  const hargaList = [5000, 5000, 5000, 5000, 5000, 8000, 10000];
  const namaMenu = [
    "IkanTenggiri",
    "AstorMini",
    "KacangArab",
    "EmpingJagung",
    "BasrengOri",
    "KeripikKaca",
    "PisangCoklat",
  ];

  function updateTotalPerItem() {
    jumlahInputs.forEach((input, i) => {
      const jumlah = parseInt(input.value) || 0;
      const total = jumlah * hargaList[i];
      totalItemEls[i].textContent = "Rp " + total.toLocaleString("id-ID");
    });
  }

  jumlahInputs.forEach((input) => {
    input.addEventListener("input", updateTotalPerItem);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = namaInput.value.trim();
    if (!nama) return alert("Nama pembeli wajib diisi!");

    let items = {};
    let total = 0;

    jumlahInputs.forEach((input, i) => {
      const jumlah = parseInt(input.value) || 0;
      if (jumlah > 0) {
        items[namaMenu[i]] = jumlah;
        total += jumlah * hargaList[i];
      }
    });

    const waktu = new Date();
    const formatted = waktu.toLocaleDateString("id-ID") + ", " + waktu.toLocaleTimeString("id-ID");

    fetch("http://localhost:3000/api/pesan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, items, total, waktu: formatted }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Response not OK");
        return res.json();
      })
      .then((data) => {
        info.textContent = "Pesanan berhasil disimpan!";
        waktuPesanan.textContent = "Waktu pemesanan: " + formatted;
        totalKeseluruhan.textContent = "Total: Rp " + total.toLocaleString("id-ID");
        tombolPesanLagi.style.display = "inline-block";
      })
      .catch((err) => {
        console.error(err);
        alert("Gagal menyimpan ke database");
      });
  });

  tombolPesanLagi.addEventListener("click", () => {
    form.reset();
    updateTotalPerItem();
    info.textContent = "";
    waktuPesanan.textContent = "";
    totalKeseluruhan.textContent = "";
    tombolPesanLagi.style.display = "none";
  });
});
