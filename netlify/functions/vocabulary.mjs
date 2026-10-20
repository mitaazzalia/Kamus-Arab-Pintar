const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8' },
});

const topics = {
  rumah: { label: 'Rumah', focus: 'ruangan, perabot, peralatan rumah, kegiatan di rumah' },
  makanan: { label: 'Makanan', focus: 'bahan makanan, buah, sayuran, minuman, rasa, memasak dan makan' },
  sekolah: { label: 'Sekolah', focus: 'kelas, mata pelajaran, alat tulis, kegiatan belajar, ujian dan kampus' },
  keluarga: { label: 'Keluarga', focus: 'anggota keluarga, hubungan kekerabatan, peran keluarga dan interaksi keluarga' },
  perjalanan: { label: 'Perjalanan', focus: 'transportasi, arah, tempat umum, perjalanan, penginapan dan tiket' },
  keseharian: { label: 'Keseharian', focus: 'salam, ungkapan sopan, waktu, pertanyaan, kebutuhan dan percakapan harian' },
  ibadah: { label: 'Ibadah', focus: 'kosakata ibadah Islam yang umum, masjid, salat, puasa dan kegiatan keagamaan' },
  tubuh: { label: 'Anggota tubuh', focus: 'anggota tubuh manusia dan fungsi dasar tubuh' },
  kesehatan: { label: 'Kesehatan', focus: 'kesehatan, klinik, gejala umum, tenaga kesehatan dan perawatan' },
  pekerjaan: { label: 'Pekerjaan', focus: 'profesi, tempat kerja, aktivitas kantor dan dunia usaha' },
  teknologi: { label: 'Teknologi', focus: 'perangkat digital, internet, aplikasi, keamanan digital dan komunikasi' },
  alam: { label: 'Alam', focus: 'cuaca, tumbuhan, hewan, bentang alam dan lingkungan' },
  'warna-angka': { label: 'Warna dan angka', focus: 'warna, bilangan, urutan, jumlah, ukuran dan hitungan sehari-hari' },
  'kata-kerja': { label: 'Kata kerja', focus: 'kata kerja umum dalam bentuk dasar/present tense orang ketiga laki-laki tunggal dengan arti Indonesia' },
  sifat: { label: 'Kata sifat', focus: 'sifat, ukuran, kualitas, kondisi, perasaan dan deskripsi benda/orang' },
};

export default async (request) => {
  if (request.method !== 'POST') return json({ error: 'Gunakan metode POST.' }, 405);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return json({ error: 'Fitur penambahan kosakata AI memerlukan OPENAI_API_KEY di Environment Variables Netlify.' }, 503);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Format permintaan tidak valid.' }, 400); }
  if (!process.env.VOCAB_ADMIN_PASSWORD) return json({ error: 'Fitur ini dikunci. Tambahkan VOCAB_ADMIN_PASSWORD di Environment Variables Netlify.' }, 503);
  if (typeof body.adminPassword !== 'string' || body.adminPassword !== process.env.VOCAB_ADMIN_PASSWORD) return json({ error: 'Password admin kosakata tidak sesuai.' }, 401);
  const requestedCount = Math.max(1, Math.min(100, Number(body.count) || 100));
  const categoryId = typeof body.category === 'string' ? body.category : '';
  const topic = topics[categoryId];
  if (!topic) return json({ error: 'Pilih satu materi/kategori terlebih dahulu.' }, 400);

  const existingWords = Array.isArray(body.existingWords)
    ? body.existingWords.slice(0, 1200).map((word) => ({ arabic: String(word.arabic || '').slice(0, 80), indo: String(word.indo || '').slice(0, 100) }))
    : [];

  const instructions = `Anda adalah penyusun kamus pedagogis bahasa Arab Fusha untuk penutur bahasa Indonesia. Buat tepat ${requestedCount} entri kosakata yang berguna, beragam, alami, dan tidak berulang untuk materi "${topic.label}". Fokus: ${topic.focus}.\n\nSyarat wajib:\n- Semua entri harus kata atau ungkapan Arab yang nyata dan wajar, bukan kata rekaan atau kombinasi acak.\n- Arab harus menggunakan harakat/tashkil yang tepat jika lazim digunakan untuk pelajar.\n- Arti bahasa Indonesia harus spesifik dan sesuai konteks, bukan terjemahan perkiraan.\n- Berikan transliterasi Latin yang konsisten dan mudah dibaca penutur Indonesia.\n- Berikan satu contoh kalimat Arab yang gramatikal beserta terjemahan Indonesianya.\n- Hindari nama diri, variasi ejaan yang sama, bentuk jamak/tunggal yang hanya mengulang entri yang sama, dan duplikasi dengan daftar yang sudah ada.\n- Gunakan kategori persis "${categoryId}".\n- Kembalikan JSON valid saja dengan bentuk {"words":[{"arabic":"...","latin":"...","indo":"...","category":"${categoryId}","emoji":"📘","exampleAr":"...","exampleId":"..."}]}. Tidak ada teks di luar JSON.`;

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5-mini',
        instructions,
        input: JSON.stringify({ existingWords }),
        text: { format: { type: 'json_object' } },
        max_output_tokens: 12000,
      }),
    });
    const data = await response.json();
    if (!response.ok) return json({ error: data?.error?.message || 'AI gagal menyusun kosakata.' }, response.status);
    const output = data.output_text || (data.output || []).flatMap((item) => item.content || []).filter((item) => item.type === 'output_text').map((item) => item.text).join('\n');
    let parsed;
    try { parsed = JSON.parse(output); } catch { return json({ error: 'AI menghasilkan format data yang tidak valid. Silakan coba lagi.' }, 502); }
    const words = Array.isArray(parsed.words) ? parsed.words.slice(0, requestedCount) : [];
    const cleaned = words.filter((word) => word && typeof word.arabic === 'string' && typeof word.indo === 'string' && word.arabic.trim() && word.indo.trim()).map((word) => ({
      arabic: word.arabic.trim(), latin: String(word.latin || '').trim(), indo: word.indo.trim(), category: categoryId,
      emoji: String(word.emoji || '📘').slice(0, 8), exampleAr: String(word.exampleAr || '').trim(), exampleId: String(word.exampleId || '').trim(),
    }));
    if (!cleaned.length) return json({ error: 'Tidak ada kosakata valid yang dikembalikan. Silakan coba lagi.' }, 502);
    return json({ words: cleaned, requested: requestedCount, model: data.model || process.env.OPENAI_MODEL || 'gpt-5-mini' });
  } catch {
    return json({ error: 'Tidak dapat terhubung ke layanan AI. Periksa koneksi dan API key.' }, 502);
  }
};

export const config = { path: '/api/vocabulary' };
