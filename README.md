# Kamus Arab Pintar

Website kamus bahasa Arab–Indonesia berbasis React + Vite, dengan kamus bergambar, pelafalan menggunakan fitur suara browser, kosakata harian, kuis, penyimpanan favorit lokal, penerjemah AI, dan asisten AI.

## Fitur

- Kamus bergambar dengan tulisan Arab, harakat, transliterasi, arti, dan contoh kalimat.
- Pencarian kosakata Arab/Indonesia dan filter kategori.
- Tombol suara untuk membaca tulisan Arab melalui Web Speech API browser.
- Favorit tersimpan di browser pengguna (localStorage).
- Kosakata harian dan kuis pemula.
- Penerjemah Arab ↔ Indonesia dan tutor AI melalui Netlify Function.
- API key disimpan di server Netlify, tidak di kode frontend.
- Tampilan responsif untuk desktop dan ponsel.

## Prasyarat

- Node.js 20 atau versi LTS terbaru yang didukung.
- Akun GitHub.
- Akun Netlify.
- API key OpenAI untuk mengaktifkan fitur AI (biaya API mengikuti akun/provider dan tidak termasuk hosting website).

## Menjalankan di komputer

1. Ekstrak ZIP proyek.
2. Buka folder proyek di VS Code.
3. Jalankan terminal di folder proyek.
4. Instal paket:

   ```bash
   npm install
   ```

5. Jalankan website dan fungsi Netlify lokal:

   ```bash
   npm run dev
   ```

6. Buka alamat yang ditampilkan di terminal, biasanya `http://localhost:8888`.

### Mengaktifkan AI saat pengujian lokal

Buat file `.env` di folder utama (jangan unggah file ini ke GitHub) dengan isi:

```env
OPENAI_API_KEY=API_KEY_ANDA
OPENAI_MODEL=gpt-5-mini
```

Restart `npm run dev` setelah menambahkan atau mengubah environment variable. Jika belum ada API key, kamus lokal tetap dapat digunakan; terjemahan AI dan tutor AI belum aktif.

## Upload ke GitHub

1. Buat repository baru di GitHub, misalnya `kamus-arab-pintar`.
2. Ekstrak ZIP ini.
3. Buka terminal di folder hasil ekstrak, lalu jalankan:

   ```bash
   git init
   git add .
   git commit -m "Initial Kamus Arab Pintar app"
   git branch -M main
   git remote add origin https://github.com/USERNAME/kamus-arab-pintar.git
   git push -u origin main
   ```

4. Ganti `USERNAME` dan nama repository sesuai akun Anda. Jangan commit `.env` atau API key.

Alternatif: gunakan tombol **Add file → Upload files** di GitHub, lalu unggah isi folder proyek. Untuk pengembangan jangka panjang, Git lebih disarankan.

## Deploy ke Netlify

1. Masuk ke Netlify dan pilih **Add new site → Import an existing project**.
2. Hubungkan akun GitHub, lalu pilih repository `kamus-arab-pintar`.
3. Pastikan pengaturan build:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions` (sudah ditetapkan di `netlify.toml`)
4. Sebelum atau sesudah deploy, buka **Site configuration → Environment variables**.
5. Tambahkan:
   - `OPENAI_API_KEY` = API key OpenAI milik Anda
   - `OPENAI_MODEL` = `gpt-5-mini` (opsional; dapat disesuaikan dengan model yang tersedia untuk akun Anda)
6. Pastikan variabel dapat diakses oleh Functions, kemudian jalankan deploy/redeploy.
7. Setelah deployment selesai, uji `/api/translate` lewat halaman Penerjemah AI dan Asisten AI.

> API key OpenAI tidak sama dengan langganan ChatGPT. Penggunaan API biasanya ditagihkan terpisah sesuai harga dan penggunaan API. Jangan pernah menaruh API key di `src/`, file HTML, atau repository publik.

## Build untuk memeriksa hasil

```bash
npm run build
npm run preview
```

Perintah `npm run preview` hanya menjalankan hasil build frontend. Untuk menguji fungsi Netlify secara lokal, gunakan `npm run dev`.

## Catatan penting

- Versi awal berisi contoh kosakata untuk demonstrasi dan dapat diperluas di `src/data/vocabulary.js`.
- Gambar kartu mengambil gambar dari Unsplash; koneksi internet dibutuhkan untuk memuat gambar eksternal. Jika gambar gagal dimuat, emoji cadangan akan terlihat.
- Suara bergantung pada dukungan browser dan ketersediaan voice Arab pada perangkat. Kualitas/aksen bisa berbeda antarperangkat.
- Data favorit disimpan di browser masing-masing dan belum disinkronkan ke akun atau database.
- Untuk aplikasi publik, tambahkan pembatasan permintaan, pemantauan biaya API, dan proteksi penyalahgunaan sebelum mempromosikan endpoint AI secara luas.
- Hasil AI perlu diperiksa kembali untuk penggunaan akademik atau keagamaan yang membutuhkan ketepatan tinggi.

## Struktur folder

```text
arabic-smart-dictionary/
├── index.html
├── package.json
├── vite.config.js
├── netlify.toml
├── .env.example
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles.css
│   └── data/
│       └── vocabulary.js
└── netlify/
    └── functions/
        └── translate.mjs
```
