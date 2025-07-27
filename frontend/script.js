document.querySelectorAll('tbody input[type="number"]').forEach(input => {
  input.addEventListener('input', updateTotalPerItem);
});

function updateTotalPerItem() {
  let total = 0;
  document.querySelectorAll('tbody tr').forEach(row => {
    const harga = parseInt(row.children[1].innerText);
    const jumlah = parseInt(row.children[2].querySelector('input').value);
    const totalItem = harga * jumlah;
    row.children[3].innerText = `Rp ${totalItem.toLocaleString()}`;
    total += totalItem;
  });
  document.getElementById('totalKeseluruhan').innerText = `Total: Rp ${total.toLocaleString()}`;
}

document.getElementById('form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const nama = document.getElementById('nama').value;
  const rows = document.querySelectorAll('tbody tr');
  const items = {};
  let total = 0;

  rows.forEach(row => {
    const namaItem = row.children[0].innerText.replace(/\s+/g, '');
    const harga = parseInt(row.children[1].innerText);
    const jumlah = parseInt(row.children[2].querySelector('input').value);
    if (jumlah > 0) {
      items[namaItem] = jumlah;
      total += harga * jumlah;
    }
  });

  const waktu = new Date().toLocaleString('id-ID', { hour12: false });
  document.getElementById('waktuPesanan').innerText = `Waktu pemesanan: ${waktu}`;
  document.getElementById('totalKeseluruhan').innerText = `Total: Rp ${total.toLocaleString()}`;

  const res = await fetch('http://localhost:3000/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nama, items, total, waktu })
  });

  const result = await res.json();
  if (res.ok) {
    document.getElementById('info').innerText = '✅ Pesanan berhasil disimpan!';
    document.getElementById('pesanLagi').style.display = 'inline-block';
  } else {
    alert(result.error);
  }
});

document.getElementById('pesanLagi').addEventListener('click', () => {
  document.getElementById('form').reset();
  document.getElementById('info').innerText = '';
  document.getElementById('waktuPesanan').innerText = '';
  document.getElementById('totalKeseluruhan').innerText = '';
  document.querySelectorAll('.totalItem').forEach(el => el.innerText = 'Rp 0');
  document.getElementById('pesanLagi').style.display = 'none';
});
