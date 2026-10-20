const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8' },
});

export default async (request) => {
  if (request.method !== 'POST') return json({ error: 'Gunakan metode POST.' }, 405);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return json({ error: 'TTS AI belum diaktifkan. Tambahkan OPENAI_API_KEY di Netlify untuk audio yang lebih konsisten.' }, 503);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Format permintaan tidak valid.' }, 400); }
  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text) return json({ error: 'Teks untuk dibacakan masih kosong.' }, 400);
  if (text.length > 1200) return json({ error: 'Teks terlalu panjang untuk pelafalan. Maksimal 1.200 karakter.' }, 413);

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts',
        voice: process.env.OPENAI_TTS_VOICE || 'coral',
        input: text,
        instructions: 'Speak the provided Arabic text clearly and naturally in Modern Standard Arabic (Fusha). Use a moderate, learner-friendly pace. Do not translate, explain, or add words. If the text is Indonesian, read it naturally in Indonesian.',
        response_format: 'mp3',
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return json({ error: errorData?.error?.message || 'Layanan suara AI gagal membuat audio.' }, response.status);
    }
    const audio = await response.arrayBuffer();
    return new Response(audio, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return json({ error: 'Tidak dapat terhubung ke layanan suara AI.' }, 502);
  }
};

export const config = { path: '/api/speech' };
