const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8' },
});

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'Content-Type' } });
  }
  if (request.method !== 'POST') return json({ error: 'Gunakan metode POST.' }, 405);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({
      error: 'AI belum diaktifkan. Tambahkan OPENAI_API_KEY pada Environment Variables di Netlify, lalu deploy ulang. Kamus lokal tetap bisa digunakan.',
      code: 'AI_NOT_CONFIGURED',
    }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Format permintaan tidak valid.' }, 400);
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  const mode = body.mode === 'tutor' ? 'tutor' : 'translate';
  const direction = body.direction === 'id-ar' ? 'id-ar' : 'ar-id';
  if (!text) return json({ error: 'Masukkan kata atau kalimat terlebih dahulu.' }, 400);
  if (text.length > 1800) return json({ error: 'Teks terlalu panjang. Maksimal 1.800 karakter.' }, 413);

  const instructions = mode === 'tutor'
    ? 'Anda adalah pengajar bahasa Arab yang ramah dan akurat untuk penutur bahasa Indonesia. Jawab dalam bahasa Indonesia yang jelas. Saat relevan, sertakan tulisan Arab berharakat, transliterasi, arti, contoh, dan penjelasan tata bahasa singkat. Bedakan bahasa Arab baku modern (Fusha) dari dialek jika penting. Jangan mengarang kepastian; jelaskan jika suatu bentuk bergantung konteks.'
    : direction === 'ar-id'
      ? 'Anda adalah kamus dan penerjemah ahli bahasa Arab Fusha ke bahasa Indonesia. Terjemahkan teks pengguna secara alami dan akurat. Jawab dengan format ringkas: Terjemahan Indonesia; Teks Arab berharakat (jika sumbernya Arab); Transliterasi (jika membantu); Catatan makna/konteks; satu contoh kalimat Arab beserta artinya. Jangan mengubah makna atau menambahkan informasi yang tidak ada. Jika sumber bukan bahasa Arab, identifikasi dengan jujur.'
      : 'Anda adalah kamus dan penerjemah ahli bahasa Indonesia ke bahasa Arab Fusha. Terjemahkan teks pengguna ke bahasa Arab yang alami dan tepat. Sertakan tulisan Arab berharakat, transliterasi Latin, arti balik bahasa Indonesia untuk pemeriksaan, catatan penggunaan singkat, dan satu contoh kalimat jika sesuai. Perhatikan jenis kelamin lawan bicara bila relevan dan jelaskan pilihan yang digunakan.';

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5-mini',
        instructions,
        input: text,
        max_output_tokens: 700,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      const detail = data?.error?.message || 'Layanan AI gagal memproses permintaan.';
      return json({ error: detail }, response.status >= 400 && response.status < 600 ? response.status : 502);
    }
    const output = data.output_text || (data.output || []).flatMap((item) => item.content || []).filter((item) => item.type === 'output_text').map((item) => item.text).join('\n');
    if (!output) return json({ error: 'AI tidak menghasilkan jawaban. Silakan coba lagi.' }, 502);
    return json({ result: output, model: data.model || process.env.OPENAI_MODEL || 'gpt-5-mini' });
  } catch (error) {
    return json({ error: 'Tidak dapat terhubung ke layanan AI. Periksa koneksi dan konfigurasi Netlify.' }, 502);
  }
};

export const config = { path: '/api/translate' };
