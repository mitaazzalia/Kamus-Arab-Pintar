# Kamus Arab Pintar

Website kamus bahasa Arab–Indonesia berbasis React + Vite, dengan kamus bergambar, audio pelafalan browser dan fallback audio AI, 459 kosakata awal dari 15 materi, materi tematik, kosakata harian, kuis, favorit, penerjemah AI, tutor AI, dan generator kosakata berbantuan AI.

## Fitur

- Kamus bergambar dengan tulisan Arab, harakat, transliterasi, arti, dan contoh kalimat.
- Pencarian kosakata Arab/Indonesia dan filter kategori.
- Tombol suara memiliki tombol “Tes suara Arab”, memprioritaskan suara Arab bawaan perangkat, lalu mencoba audio AI melalui Netlify Function bila suara bawaan tidak tersedia/gagal. Jalur fungsi audio memiliki fallback untuk deployment Netlify.
- Favorit tersimpan di browser pengguna (localStorage).
- Kosakata harian dan kuis pemula.
- Penerjemah Arab ↔ Indonesia, tutor AI, dan generator kosakata per materi melalui Netlify Functions.
- 15 materi/kategori dengan target 2.000 kosakata per materi. Tersedia generator satu batch (hingga 100 kata) dan tombol “Isi sampai 2.000 kata” untuk melanjutkan beberapa batch secara otomatis setelah admin memasukkan password.
- Kosakata hasil AI disimpan pada IndexedDB di browser admin (dengan localStorage sebagai fallback), dapat diekspor sebagai JSON, lalu ditinjau dan dimasukkan ke source code agar tersedia untuk semua pengunjung.
- Tampilan kamus membatasi 60 kartu per halaman dan menyediakan tombol muat berikutnya agar daftar besar tetap ringan.
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
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_TTS_VOICE=coral
VOCAB_ADMIN_PASSWORD=ganti_dengan_password_admin_yang_kuat
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
5. Tambahkan environment variables berikut:
   - `OPENAI_API_KEY` = API key OpenAI milik Anda.
   - `OPENAI_MODEL` = `gpt-5-mini` (opsional; sesuaikan dengan model yang tersedia di akun Anda).
   - `VOCAB_ADMIN_PASSWORD` = password admin yang kuat untuk generator kosakata.
   - `OPENAI_TTS_MODEL` = `gpt-4o-mini-tts` (opsional).
   - `OPENAI_TTS_VOICE` = `coral` (opsional).
6. Pastikan variabel dapat diakses oleh Functions, kemudian jalankan deploy/redeploy.
7. Setelah deployment selesai, uji `/api/translate` lewat halaman Penerjemah AI dan Asisten AI serta uji tombol audio. Generator kosakata hanya bisa dipakai dengan password admin.

> API key OpenAI tidak sama dengan langganan ChatGPT. Penggunaan API biasanya ditagihkan terpisah sesuai harga dan penggunaan API. Jangan pernah menaruh API key di `src/`, file HTML, atau repository publik.

## Menambah kosakata per materi hingga target 2.000 kata

1. Atur `OPENAI_API_KEY` dan `VOCAB_ADMIN_PASSWORD` di Netlify, lalu deploy ulang.
2. Buka **Kamus bergambar**, pilih satu materi, lalu masukkan password admin kosakata.
3. Klik **Tambah 100 kata AI** untuk satu batch, atau **Isi sampai 2.000 kata** untuk menyusun batch berulang pada materi yang sedang dipilih. Fitur isi otomatis meminta konfirmasi karena dapat memerlukan sekitar 20–30 permintaan AI dan menggunakan kuota API. Setiap batch menyaring duplikasi berdasarkan tulisan Arab; hasil AI tetap harus ditinjau.
4. Setelah mengumpulkan batch, klik **Unduh ... kata AI (.json)**.
5. Salin file JSON ke folder proyek lokal, lalu jalankan:

   ```bash
   npm run import:vocabulary -- ./kamus-arab-generated.json
   ```

6. Periksa file `src/data/vocabulary-imported.js`, lakukan koreksi bahasa bila diperlukan, lalu commit dan push perubahan ke GitHub. Netlify akan membangun ulang website sehingga kosakata impor tersedia bagi semua pengunjung.

> Arsip awal berisi 459 entri kosakata awal, bukan 2.000 kata pada setiap materi. Target 2.000 kata per materi dicapai dengan generator AI dan memerlukan API key, kuota/budget API, serta pemeriksaan kualitas. Setelah semua kategori selesai digenerasi, ekspor seluruh kata AI sekali, impor ke source code, lalu deploy ulang supaya data menjadi bagian dari website publik.

## Build untuk memeriksa hasil

```bash
npm run build
npm run preview
```

Perintah `npm run preview` hanya menjalankan hasil build frontend. Untuk menguji fungsi Netlify secara lokal, gunakan `npm run dev`.

## Catatan penting

- Versi awal berisi 126 kosakata untuk demonstrasi dan dapat diperluas melalui `src/data/vocabulary-extra.js`, `src/data/vocabulary-imported.js`, atau generator admin.
- Gambar kartu mengambil gambar dari Unsplash; koneksi internet dibutuhkan untuk memuat gambar eksternal. Jika gambar gagal dimuat, emoji cadangan akan terlihat.
- Suara bergantung pada dukungan browser dan ketersediaan voice Arab pada perangkat. Kualitas/aksen bisa berbeda antarperangkat.
- Data favorit disimpan di localStorage dan kosakata AI di IndexedDB pada browser masing-masing; data tersebut belum otomatis disinkronkan ke akun atau database.
- Jika tombol suara belum mengeluarkan bunyi, klik **Tes suara Arab**, pastikan volume perangkat/browser aktif, dan coba Chrome/Edge. Jika perangkat tidak memiliki suara Arab, tambahkan dukungan bahasa/speech Arab pada pengaturan sistem operasi atau isi `OPENAI_API_KEY`, `OPENAI_TTS_MODEL`, dan `OPENAI_TTS_VOICE` di Environment Variables Netlify lalu deploy ulang. Penggunaan API TTS dapat dikenai biaya.
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
│       ├── vocabulary.js
│       ├── vocabulary-extra.js
│       ├── vocabulary-expanded.js
│       └── vocabulary-imported.js
├── scripts/
│   └── import-vocabulary.mjs
└── netlify/
    └── functions/
        ├── translate.mjs
        ├── speech.mjs
        └── vocabulary.mjs
```

## Kosakata awal tambahan

File `src/data/vocabulary-expanded.js` berisi kosakata awal tambahan yang dikelompokkan ke 15 materi. Total data awal proyek saat ini adalah sekitar 459 entri unik setelah duplikasi tulisan Arab disaring. Kata-kata tambahan tidak semuanya memiliki contoh kalimat; generator AI menyertakan contoh kalimat Arab dan terjemahan untuk entri baru.

## Palet warna

Tema visual menggunakan palet yang telah ditentukan:

- Hijau utama: `#4F7D32`
- Kuning lembut: `#FFD16A`
- Kuning keemasan: `#F5B52E`
- Merah aksen/peringatan: `#D9361E`

Palet diterapkan pada navigasi, tombol utama, banner, kartu kosakata, indikator, dan keadaan kuis.
