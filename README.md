# ocey P. x — shared luxury gallery

## Yang penting
HTML/CSS/JS saja tidak bisa membuat foto yang di-upload di HP A otomatis muncul di HP B.
Project ini sudah disiapkan memakai Supabase sebagai cloud backend:
- Supabase Storage = file foto/video
- PostgreSQL = metadata, judul, tag, favorit, tanggal, ukuran
- Supabase Auth = izin upload/edit/delete
- Browser = UI gallery

Supabase merekomendasikan penyimpanan file media di Storage, bukan database, dan Storage-nya dilayani lewat CDN. Untuk file besar, metode resumable upload lebih cocok; versi ini memakai upload browser standar untuk setup yang sederhana. 

## Setup 1 — buat Supabase
1. Buka https://supabase.com/
2. Buat project baru.
3. Buka SQL Editor.
4. Jalankan seluruh isi `supabase.sql`.
5. Buka Storage → New bucket → buat `ocey-media`.
6. Jadikan bucket PUBLIC bila ingin semua orang bisa melihat galeri tanpa login.
7. Buka Authentication → Providers → Email dan aktifkan Email/Password.

## Setup 2 — masukkan API
Buka `config.js`, isi:
- SUPABASE_URL = URL project
- SUPABASE_KEY = publishable/anon key

Jangan pernah memasukkan `service_role`/secret key ke `config.js`.

## Setup 3 — deploy
Bisa langsung dipasang di GitHub Pages / Netlify / Vercel sebagai static site.
Upload:
- index.html
- styles.css
- config.js
- app.js
- supabase.sql

## Cara sinkron antar HP
HP A:
1. Buka website.
2. Sign in dengan akun yang sama.
3. Upload foto/video.

HP B:
1. Buka website yang sama.
2. Galeri membaca database + Storage yang sama.
3. Foto/video dari HP A muncul.

Kalau HP B juga mau upload/delete, login dengan akun yang sama (atau buat akun authenticated lain jika policy kamu ingin diperluas).

## Catatan keamanan
Jangan menaruh service_role key di frontend.
Policy SQL di project ini membuat data media dapat dilihat publik, tetapi perubahan file/database dibatasi ke user yang sudah login.
