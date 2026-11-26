# Kontrol Proyek

Aplikasi web untuk menghitung volume pekerjaan, kebutuhan material, progres, dan membuat laporan harian, mingguan, dan bulanan.

## Menjalankan
Tanpa instalasi: buka `index.html` di browser.
Atau di Cursor: pasang ekstensi Live Server, klik kanan `index.html`, pilih Open with Live Server.
Alternatif lewat terminal: `npx serve .`

## Struktur
- `index.html`  kerangka halaman
- `style.css`   tampilan (mode terang dan gelap)
- `app.js`      logika: item, material, progres, laporan (data disimpan di localStorage)

## Ide pengembangan (tempel ke chat Cursor)
- Ekspor laporan ke Excel (.xlsx) memakai SheetJS, mengikuti format template laporan saya
- Tambah kurva S: rencana vs realisasi per minggu
- Tambah kalkulator material untuk jenis pekerjaan lain (beton, pembesian, bekisting)
- Simpan data ke file JSON (ekspor dan impor) agar bisa dipindah antar perangkat
- Ubah menjadi proyek Vite + React bila fitur makin banyak

## Pasang di HP (PWA)
Aplikasi harus dibuka lewat https agar bisa dipasang. Cara termudah:
1. Buka app.netlify.com/drop, lalu seret seluruh folder ini ke halaman tersebut.
2. Buka alamat yang diberikan di Chrome (Android) atau Safari (iPhone).
3. Android: menu titik tiga > Tambahkan ke layar utama (Install app). iPhone: Bagikan > Tambah ke Layar Utama.
4. Setelah dibuka sekali dengan internet, aplikasi bisa dipakai tanpa sinyal.

Setelah mengubah kode, naikkan nomor versi `CACHE` di `sw.js` (misalnya v2) agar HP memuat versi terbaru.
Data tersimpan di HP masing-masing dan tidak ikut berpindah saat aplikasi diperbarui.
