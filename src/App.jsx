import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownUp, ArrowLeft, ArrowRight, BookOpen, Bookmark, Check, ChevronDown,
  CircleHelp, Clock3, Compass, Copy, GraduationCap, Headphones, Heart, Home,
  Languages, Lightbulb, Menu, MessageCircle, Mic2, Search, Send, Sparkles,
  Volume2, X, Zap,
} from 'lucide-react';
import { categories, localTranslations, vocabulary } from './data/vocabulary.js';

const navItems = [
  { id: 'home', label: 'Beranda', icon: Home },
  { id: 'dictionary', label: 'Kamus bergambar', icon: BookOpen },
  { id: 'translator', label: 'Penerjemah AI', icon: Languages },
  { id: 'daily', label: 'Kosakata harian', icon: Clock3 },
  { id: 'tutor', label: 'Asisten AI', icon: Sparkles },
  { id: 'quiz', label: 'Latihan kuis', icon: GraduationCap },
];

const quizQuestions = [
  { question: 'Apa arti kata كِتَابٌ?', options: ['Meja', 'Buku', 'Pintu', 'Sekolah'], answer: 'Buku', hint: 'Kata ini sering ditemukan di kelas.' },
  { question: 'Bagaimana bahasa Arab “terima kasih”?', options: ['مَرْحَبًا', 'مَعَ السَّلَامَةِ', 'شُكْرًا', 'نَعَمْ'], answer: 'شُكْرًا', hint: 'Dibaca: shukran.' },
  { question: 'Apa arti مَاءٌ?', options: ['Air', 'Roti', 'Apel', 'Susu'], answer: 'Air', hint: 'Kita meminumnya setiap hari.' },
  { question: 'Bahasa Arab untuk “rumah” adalah …', options: ['مَدْرَسَةٌ', 'بَيْتٌ', 'مَسْجِدٌ', 'سُوْقٌ'], answer: 'بَيْتٌ', hint: 'Dibaca: baytun.' },
  { question: 'Apa arti صَبَاحُ الْخَيْرِ?', options: ['Selamat malam', 'Sampai jumpa', 'Selamat pagi', 'Apa kabar'], answer: 'Selamat pagi', hint: 'Ucapan yang digunakan pada pagi hari.' },
];

const normalizeArabic = (value = '') => value.normalize('NFD').replace(/[\u064B-\u065F\u0670]/g, '').replace(/[؟?!.,،]/g, '').trim();

function speak(text, lang = 'ar-SA', notify = () => {}) {
  if (!('speechSynthesis' in window)) {
    notify('Browser ini belum mendukung fitur suara. Coba gunakan Chrome atau Edge terbaru.');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.82;
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((item) => item.lang.toLowerCase().startsWith(lang.toLowerCase().split('-')[0]));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function getDailyWord() {
  const dayNumber = Math.floor(Date.now() / 86400000);
  return vocabulary[dayNumber % vocabulary.length];
}

function App() {
  const [page, setPage] = useState('home');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('semua');
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('arabic-smart-favorites') || '[]'); } catch { return []; }
  });
  const [toast, setToast] = useState('');
  const [direction, setDirection] = useState('ar-id');
  const [translationText, setTranslationText] = useState('');
  const [translationResult, setTranslationResult] = useState('');
  const [translationLoading, setTranslationLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState('');
  const [quizScore, setQuizScore] = useState(0);
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dailyWord = useMemo(getDailyWord, []);

  useEffect(() => {
    localStorage.setItem('arabic-smart-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredVocabulary = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('id-ID');
    return vocabulary.filter((item) => {
      const matchesCategory = activeCategory === 'semua' || item.category === activeCategory;
      const matchesSearch = !query || [item.arabic, item.latin, item.indo, item.exampleId].some((value) => value.toLocaleLowerCase('id-ID').includes(query));
      const matchesFavoritesPage = page !== 'favorites' || favorites.includes(item.id);
      return matchesCategory && matchesSearch && matchesFavoritesPage;
    });
  }, [activeCategory, favorites, page, search]);

  function toggleFavorite(id) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setToast(favorites.includes(id) ? 'Dihapus dari kata tersimpan.' : 'Disimpan ke kata favorit.');
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      setToast('Teks berhasil disalin.');
    } catch {
      setToast('Fitur salin tidak tersedia pada browser ini.');
    }
  }

  function findLocalTranslation(input, dir) {
    const trimmed = input.trim();
    const query = trimmed.toLocaleLowerCase('id-ID').replace(/[؟?!.,،]/g, '').trim();
    let found = vocabulary.find((item) => dir === 'ar-id'
      ? normalizeArabic(item.arabic) === normalizeArabic(trimmed)
      : item.indo.toLocaleLowerCase('id-ID') === query);

    if (!found && dir === 'id-ar' && localTranslations[query]) {
      found = vocabulary.find((item) => normalizeArabic(item.arabic) === normalizeArabic(localTranslations[query]));
      if (!found) return `Bahasa Arab: ${localTranslations[query]}\n\nCatatan: Hasil ini berasal dari kamus lokal. Hubungkan AI API untuk mendapatkan transliterasi dan penjelasan konteks.`;
    }
    if (!found) return null;
    if (dir === 'ar-id') {
      return `Arti: ${found.indo}\nTransliterasi: ${found.latin.trim()}\n\nContoh: ${found.exampleAr}\n${found.exampleId}\n\nCatatan: Hasil ini berasal dari kamus lokal. Hubungkan AI API untuk menerjemahkan kalimat bebas dan mendapatkan penjelasan konteks.`;
    }
    return `Bahasa Arab: ${found.arabic}\nTransliterasi: ${found.latin.trim()}\nArti balik: ${found.indo}\n\nContoh: ${found.exampleAr}\n${found.exampleId}\n\nCatatan: Hasil ini berasal dari kamus lokal. Hubungkan AI API untuk menerjemahkan kalimat bebas dan mendapatkan penjelasan konteks.`;
  }

  async function requestAI({ text, mode = 'translate', dir = direction }) {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, mode, direction: dir }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || 'Permintaan AI gagal.');
      error.code = data.code;
      throw error;
    }
    return data.result;
  }

  async function handleTranslate(event) {
    event?.preventDefault();
    const input = translationText.trim();
    if (!input) { setToast('Masukkan kata atau kalimat yang ingin diterjemahkan.'); return; }
    setTranslationLoading(true);
    setTranslationResult('');
    try {
      const result = await requestAI({ text: input, mode: 'translate', dir: direction });
      setTranslationResult(result);
    } catch (error) {
      const local = findLocalTranslation(input, direction);
      if (local) setTranslationResult(local);
      else setTranslationResult(`Belum dapat menerjemahkan dengan AI.\n\n${error.message}\n\nAnda tetap dapat mencari kata yang tersedia di menu Kamus Bergambar. Untuk mengaktifkan terjemahan AI, tambahkan OPENAI_API_KEY di pengaturan environment Netlify dan deploy ulang.`);
    } finally {
      setTranslationLoading(false);
    }
  }

  async function handleTutor(event) {
    event?.preventDefault();
    const question = aiQuestion.trim();
    if (!question) { setToast('Tulis pertanyaan terlebih dahulu.'); return; }
    setAiLoading(true);
    setAiAnswer('');
    try {
      setAiAnswer(await requestAI({ text: question, mode: 'tutor' }));
    } catch (error) {
      setAiAnswer(`Asisten AI belum dapat menjawab karena koneksi AI belum tersedia.\n\n${error.message}\n\nTambahkan OPENAI_API_KEY pada pengaturan Netlify untuk mengaktifkan fitur ini. Sementara itu, Anda bisa membuka Kamus Bergambar atau Latihan Kuis.`);
    } finally {
      setAiLoading(false);
    }
  }

  function selectPage(nextPage) {
    setPage(nextPage);
    setMobileMenuOpen(false);
    if (nextPage !== 'dictionary' && nextPage !== 'favorites') setSearch('');
    if (nextPage === 'favorites') setActiveCategory('semua');
    if (nextPage === 'dictionary') setActiveCategory('semua');
  }

  function resetQuiz() {
    setQuizIndex(0); setQuizChoice(''); setQuizScore(0); setQuizChecked(false); setQuizDone(false);
  }

  function checkQuiz() {
    if (!quizChoice) { setToast('Pilih salah satu jawaban terlebih dahulu.'); return; }
    if (!quizChecked && quizChoice === quizQuestions[quizIndex].answer) setQuizScore((score) => score + 1);
    setQuizChecked(true);
  }

  function nextQuiz() {
    if (quizIndex === quizQuestions.length - 1) { setQuizDone(true); return; }
    setQuizIndex((index) => index + 1); setQuizChoice(''); setQuizChecked(false);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
        <button className="brand" onClick={() => selectPage('home')} aria-label="Kamus Arab Pintar beranda">
          <span className="brand-mark"><BookOpen size={22} strokeWidth={2.1} /></span>
          <span className="brand-copy"><strong>Kamus Arab</strong><small>PINTAR</small></span>
        </button>
        <div className="sidebar-label">MENU UTAMA</div>
        <nav className="side-nav" aria-label="Navigasi utama">
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} className={`nav-item ${page === item.id ? 'active' : ''}`} onClick={() => selectPage(item.id)}>
              <Icon size={18} strokeWidth={1.9} /><span>{item.label}</span>{item.id === 'tutor' && <span className="nav-new">AI</span>}
            </button>;
          })}
        </nav>
        <div className="sidebar-label sidebar-label-spaced">KOLEKSI SAYA</div>
        <button className={`nav-item ${page === 'favorites' ? 'active' : ''}`} onClick={() => selectPage('favorites')}>
          <Bookmark size={18} strokeWidth={1.9} /><span>Kata tersimpan</span><span className="nav-count">{favorites.length}</span>
        </button>
        <div className="sidebar-bottom">
          <div className="study-card">
            <span className="study-card-icon"><Lightbulb size={19} /></span>
            <strong>Belajar sedikit, setiap hari.</strong>
            <p>5 menit sehari bisa jadi awal yang baik untuk mahir bahasa Arab.</p>
            <button onClick={() => selectPage('daily')}>Mulai belajar <ArrowRight size={14} /></button>
          </div>
          <div className="sidebar-footer"><span className="status-dot" /> Kamus lokal siap digunakan</div>
        </div>
      </aside>

      {mobileMenuOpen && <button className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} aria-label="Tutup menu" />}

      <div className="main-column">
        <header className="topbar">
          <button className="mobile-menu-button icon-button" onClick={() => setMobileMenuOpen((open) => !open)} aria-label="Buka menu"><Menu size={21} /></button>
          <div className="breadcrumb"><span>Belajar Bahasa Arab</span><span className="breadcrumb-slash">/</span><strong>{navItems.find((item) => item.id === page)?.label || (page === 'favorites' ? 'Kata tersimpan' : 'Kamus Arab')}</strong></div>
          <div className="topbar-actions">
            <label className="global-search"><Search size={17} /><input value={search} onChange={(event) => { setSearch(event.target.value); if (page !== 'dictionary' && page !== 'favorites') setPage('dictionary'); }} placeholder="Cari kosakata..." aria-label="Cari kosakata" /><kbd>⌘ K</kbd></label>
            <button className="topbar-avatar" title="Kamus Arab Pintar"><span>ع</span></button>
          </div>
        </header>

        <main className="page-content">
          {page === 'home' && <HomePage dailyWord={dailyWord} selectPage={selectPage} setActiveCategory={setActiveCategory} speak={speak} setToast={setToast} favorites={favorites} toggleFavorite={toggleFavorite} />}
          {(page === 'dictionary' || page === 'favorites') && <DictionaryPage page={page} search={search} setSearch={setSearch} activeCategory={activeCategory} setActiveCategory={setActiveCategory} filteredVocabulary={filteredVocabulary} favorites={favorites} toggleFavorite={toggleFavorite} speak={speak} setToast={setToast} />}
          {page === 'translator' && <TranslatorPage direction={direction} setDirection={setDirection} translationText={translationText} setTranslationText={setTranslationText} translationResult={translationResult} setTranslationResult={setTranslationResult} translationLoading={translationLoading} handleTranslate={handleTranslate} speak={speak} copyText={copyText} setToast={setToast} />}
          {page === 'daily' && <DailyPage dailyWord={dailyWord} speak={speak} setToast={setToast} selectPage={selectPage} />}
          {page === 'tutor' && <TutorPage aiQuestion={aiQuestion} setAiQuestion={setAiQuestion} aiAnswer={aiAnswer} aiLoading={aiLoading} handleTutor={handleTutor} setAiQuestionText={(value) => setAiQuestion(value)} />}
          {page === 'quiz' && <QuizPage quizIndex={quizIndex} quizChoice={quizChoice} setQuizChoice={setQuizChoice} quizScore={quizScore} quizChecked={quizChecked} quizDone={quizDone} checkQuiz={checkQuiz} nextQuiz={nextQuiz} resetQuiz={resetQuiz} />}
        </main>
        <footer className="page-footer"><span>© 2026 Kamus Arab Pintar</span><span>Belajar bahasa Arab, satu kata setiap hari <span className="footer-heart">♥</span></span></footer>
      </div>
      {toast && <div className="toast-message" role="status"><Check size={17} />{toast}<button onClick={() => setToast('')} aria-label="Tutup notifikasi"><X size={15} /></button></div>}
    </div>
  );
}

function HomePage({ dailyWord, selectPage, setActiveCategory, speak, setToast, favorites, toggleFavorite }) {
  const featured = [vocabulary[8], vocabulary[4], vocabulary[0], vocabulary[24]];
  return <div className="page-stack">
    <section className="welcome-row"><div><p className="eyebrow">SELAMAT DATANG DI RUANG BELAJAR</p><h1>Assalamu’alaikum! <span className="wave">✦</span></h1><p className="muted intro-text">Mari temukan kata baru, pahami maknanya, dan mulai berbicara bahasa Arab dengan percaya diri.</p></div><div className="welcome-pill"><span className="pulse-dot" /> Ruang belajar Anda</div></section>
    <section className="hero-banner">
      <div className="hero-content"><span className="hero-kicker"><Sparkles size={14} /> BELAJAR LEBIH MENYENANGKAN</span><h2>Bahasa Arab jadi<br /><em>lebih dekat.</em></h2><p>Kamus bergambar, suara pelafalan, dan bantuan AI dalam satu tempat.</p><div className="hero-actions"><button className="button button-white" onClick={() => selectPage('dictionary')}>Jelajahi kamus <ArrowRight size={16} /></button><button className="button button-ghost" onClick={() => selectPage('translator')}><Languages size={16} /> Coba penerjemah</button></div></div>
      <div className="hero-art" aria-hidden="true"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-book"><BookOpen size={60} strokeWidth={1.2} /><span>عَرَبِيّ</span></div><span className="floating-letter letter-one">ع</span><span className="floating-letter letter-two">م</span><span className="floating-letter letter-three">ب</span><span className="floating-spark spark-one">✦</span><span className="floating-spark spark-two">✧</span></div>
      <div className="hero-bottom-note"><span className="mini-avatar-stack"><i>ع</i><i>ب</i><i>م</i></span><span>Mulai dari kata sederhana, tumbuh setiap hari.</span></div>
    </section>
    <section className="stat-grid">
      <div className="stat-card"><span className="stat-icon stat-teal"><BookOpen size={19} /></span><div><strong>36+</strong><span>Kosakata awal</span></div><span className="stat-note">Terus bertambah</span></div>
      <div className="stat-card"><span className="stat-icon stat-orange"><Headphones size={19} /></span><div><strong>Audio</strong><span>Pelafalan kata</span></div><span className="stat-note">Klik untuk dengar</span></div>
      <div className="stat-card"><span className="stat-icon stat-purple"><Sparkles size={19} /></span><div><strong>AI</strong><span>Penerjemah pintar</span></div><span className="stat-note">Perlu API key</span></div>
      <div className="stat-card"><span className="stat-icon stat-blue"><Heart size={19} /></span><div><strong>{favorites.length}</strong><span>Kata tersimpan</span></div><span className="stat-note">Koleksi pribadi</span></div>
    </section>
    <section className="section-block"><div className="section-heading"><div><p className="eyebrow">MULAI DARI SINI</p><h2>Jelajahi berdasarkan tema</h2><p className="muted">Pilih topik yang paling dekat dengan keseharianmu.</p></div><button className="text-link" onClick={() => selectPage('dictionary')}>Lihat semua <ArrowRight size={15} /></button></div><div className="topic-grid">{categories.filter((item) => item.id !== 'semua').slice(0, 6).map((item, index) => <button className={`topic-card topic-${index + 1}`} key={item.id} onClick={() => { setActiveCategory(item.id); selectPage('dictionary'); }}><span className="topic-emoji">{item.icon}</span><span className="topic-label">{item.label}</span><span className="topic-count">{vocabulary.filter((word) => word.category === item.id).length} kata</span><ArrowRight className="topic-arrow" size={16} /></button>)}</div></section>
    <section className="section-block"><div className="section-heading"><div><p className="eyebrow">KOSAKATA PILIHAN</p><h2>Kata untuk hari ini</h2><p className="muted">Kenali kata, dengarkan bunyinya, lalu coba gunakan dalam kalimat.</p></div><button className="text-link" onClick={() => selectPage('daily')}>Kosakata harian <ArrowRight size={15} /></button></div><div className="vocab-grid vocab-grid-featured">{featured.map((item) => <VocabCard key={item.id} item={item} speak={speak} favorites={favorites} toggleFavorite={toggleFavorite} setToast={setToast} />)}</div></section>
    <section className="daily-strip"><div className="daily-strip-icon">☀️</div><div><span className="eyebrow">KOSAKATA HARI INI</span><h3>{dailyWord.arabic} <span>— {dailyWord.indo}</span></h3><p>{dailyWord.latin.trim()} · {dailyWord.exampleId}</p></div><button className="button button-outline" onClick={() => selectPage('daily')}>Belajar kata ini <ArrowRight size={15} /></button><button className="sound-circle" onClick={() => speak(dailyWord.arabic, 'ar-SA', setToast)} aria-label="Dengarkan kosakata hari ini"><Volume2 size={19} /></button></section>
  </div>;
}

function DictionaryPage({ page, search, setSearch, activeCategory, setActiveCategory, filteredVocabulary, favorites, toggleFavorite, speak, setToast }) {
  return <div className="page-stack">
    <section className="page-title-row"><div><p className="eyebrow">TEMUKAN KATA YANG TEPAT</p><h1>{page === 'favorites' ? 'Kata tersimpan' : 'Kamus bergambar'}</h1><p className="muted">{page === 'favorites' ? 'Kumpulan kosakata yang Anda tandai untuk dipelajari kembali.' : 'Lihat gambar, baca tulisan Arab, lalu dengarkan cara pengucapannya.'}</p></div><span className="title-count"><BookOpen size={17} /> {filteredVocabulary.length} kata</span></section>
    <div className="dictionary-toolbar"><label className="dictionary-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari dalam bahasa Arab atau Indonesia..." /><kbd>/</kbd></label><button className="filter-button" onClick={() => setActiveCategory('semua')}><Compass size={17} /> Semua tema <ChevronDown size={15} /></button></div>
    <div className="category-chips">{categories.map((category) => <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`category-chip ${activeCategory === category.id ? 'selected' : ''}`}><span>{category.icon}</span>{category.label}</button>)}</div>
    {filteredVocabulary.length ? <div className="vocab-grid">{filteredVocabulary.map((item) => <VocabCard key={item.id} item={item} speak={speak} favorites={favorites} toggleFavorite={toggleFavorite} setToast={setToast} />)}</div> : <div className="empty-state"><span>🔎</span><h3>Kosakata belum ditemukan</h3><p>Coba kata lain atau pilih kategori “Semua kata”.</p><button className="button button-primary" onClick={() => { setSearch(''); setActiveCategory('semua'); }}>Tampilkan semua kata</button></div>}
    <div className="dictionary-tip"><Lightbulb size={19} /><p><strong>Tips belajar:</strong> Dengarkan pelafalan sambil membaca tulisan Arab. Ulangi 2–3 kali, lalu gunakan kata tersebut dalam kalimat sederhana.</p></div>
  </div>;
}

function VocabCard({ item, speak, favorites, toggleFavorite, setToast }) {
  const saved = favorites.includes(item.id);
  return <article className="vocab-card">
    <div className="vocab-image-wrap"><div className="vocab-image-fallback">{item.emoji}</div>{item.image && <img className="vocab-image" src={item.image} alt={item.indo} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} />}<span className="vocab-category-tag">{categories.find((category) => category.id === item.category)?.label || 'Kosakata'}</span><button className={`favorite-button ${saved ? 'is-saved' : ''}`} onClick={() => toggleFavorite(item.id)} aria-label={saved ? 'Hapus dari tersimpan' : 'Simpan kosakata'}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button></div>
    <div className="vocab-card-body"><div className="vocab-arabic-row"><div><h3 className="arabic-text" dir="rtl" lang="ar">{item.arabic}</h3><p className="vocab-latin">{item.latin.trim()}</p></div><button className="sound-button" onClick={() => speak(item.arabic, 'ar-SA', setToast)} aria-label={`Dengarkan ${item.arabic}`}><Volume2 size={18} /></button></div><p className="vocab-meaning">{item.indo}</p><div className="vocab-example"><p className="example-arabic" dir="rtl" lang="ar">{item.exampleAr}</p><p>{item.exampleId}</p></div></div>
  </article>;
}

function TranslatorPage({ direction, setDirection, translationText, setTranslationText, translationResult, setTranslationResult, translationLoading, handleTranslate, speak, copyText, setToast }) {
  const isArabicToIndonesian = direction === 'ar-id';
  return <div className="page-stack">
    <section className="page-title-row"><div><p className="eyebrow">PAHAMI MAKNA, BUKAN SEKADAR KATA</p><h1>Penerjemah AI</h1><p className="muted">Terjemahkan kata dan kalimat Arab–Indonesia dengan bantuan AI.</p></div><span className="ai-badge"><Sparkles size={15} /> AI translator</span></section>
    <div className="translator-notice"><span className="notice-icon"><Zap size={18} /></span><p><strong>Lebih dari terjemahan kata.</strong> Saat AI aktif, Anda juga akan mendapat transliterasi, penjelasan konteks, dan contoh penggunaan.</p></div>
    <form className="translator-grid" onSubmit={handleTranslate}>
      <section className="translation-panel"><div className="translation-panel-head"><span>{isArabicToIndonesian ? 'Bahasa Arab' : 'Bahasa Indonesia'}</span><span className="language-code">{isArabicToIndonesian ? 'AR' : 'ID'}</span></div><textarea value={translationText} onChange={(event) => setTranslationText(event.target.value)} placeholder={isArabicToIndonesian ? 'اكتب كلمة أو جملة هنا…\n\nKetik kata atau kalimat Arab di sini' : 'Ketik kata atau kalimat dalam bahasa Indonesia di sini…'} dir={isArabicToIndonesian ? 'auto' : 'ltr'} maxLength={1800} /><div className="translation-panel-foot"><span>{translationText.length}/1.800 karakter</span><button type="button" className="small-icon-button" onClick={() => { setTranslationText(''); setTranslationResult(''); }} title="Hapus teks"><X size={16} /></button></div></section>
      <div className="direction-switch-wrap"><button type="button" className="direction-switch" onClick={() => { setDirection(isArabicToIndonesian ? 'id-ar' : 'ar-id'); setTranslationResult(''); }} aria-label="Tukar arah terjemahan"><ArrowDownUp size={19} /></button></div>
      <section className="translation-panel result-panel"><div className="translation-panel-head"><span>{isArabicToIndonesian ? 'Bahasa Indonesia' : 'Bahasa Arab'}</span><span className="language-code">{isArabicToIndonesian ? 'ID' : 'AR'}</span></div><div className={`translation-output ${translationResult ? 'has-result' : ''}`} aria-live="polite">{translationLoading ? <div className="loading-state"><span className="spinner" /><span>Sedang menerjemahkan…</span></div> : translationResult ? <p>{translationResult}</p> : <div className="result-placeholder"><span className="result-placeholder-icon"><Languages size={23} /></span><strong>Hasil terjemahan akan muncul di sini</strong><span>Masukkan teks, lalu tekan tombol terjemahkan.</span></div>}</div><div className="translation-panel-foot"><span>{translationResult ? 'Periksa konteks sebelum digunakan' : 'Menunggu teks'}</span>{translationResult && <div className="result-actions"><button type="button" className="small-icon-button" onClick={() => copyText(translationResult)} title="Salin hasil"><Copy size={16} /></button><button type="button" className="small-icon-button" onClick={() => speak(translationResult.split('\n')[0], isArabicToIndonesian ? 'id-ID' : 'ar-SA', setToast)} title="Dengarkan hasil"><Volume2 size={16} /></button></div>}</div></section>
      <div className="translate-submit-row"><span><Sparkles size={15} /> Terjemahan AI memerlukan API key aktif.</span><button className="button button-primary translate-submit" type="submit" disabled={translationLoading}>{translationLoading ? <><span className="button-spinner" /> Memproses…</> : <>Terjemahkan <ArrowRight size={16} /></>}</button></div>
    </form>
    <section className="section-block translator-examples"><div className="section-heading"><div><p className="eyebrow">COBA KALIMAT INI</p><h2>Mulai dengan contoh</h2></div></div><div className="example-prompt-grid">{['السلام عليكم', 'Apa kabar?', 'Saya ingin belajar bahasa Arab', 'Terima kasih banyak'].map((example) => <button key={example} onClick={() => { setTranslationText(example); setDirection(/[\u0600-\u06FF]/.test(example) ? 'ar-id' : 'id-ar'); setTranslationResult(''); }}><span>{example}</span><ArrowRight size={15} /></button>)}</div></section>
  </div>;
}

function DailyPage({ dailyWord, speak, setToast, selectPage }) {
  const dailyPhrases = [vocabulary[24], vocabulary[28], vocabulary[29], vocabulary[32], vocabulary[33], vocabulary[34]];
  return <div className="page-stack">
    <section className="page-title-row"><div><p className="eyebrow">KEBIASAAN KECIL, KEMAJUAN BESAR</p><h1>Kosakata harian</h1><p className="muted">Luangkan beberapa menit untuk menambah perbendaharaan kata.</p></div><span className="streak-badge"><span>✦</span> Belajar setiap hari</span></section>
    <section className="daily-feature"><div className="daily-feature-left"><span className="daily-feature-label"><Clock3 size={15} /> KATA PILIHAN HARI INI</span><h2 className="daily-feature-arabic" dir="rtl" lang="ar">{dailyWord.arabic}</h2><h3>{dailyWord.indo}</h3><p className="daily-feature-latin">{dailyWord.latin.trim()}</p><div className="daily-feature-example"><span>CONTOH PENGGUNAAN</span><p className="example-arabic" dir="rtl" lang="ar">{dailyWord.exampleAr}</p><p>{dailyWord.exampleId}</p></div><div className="daily-feature-actions"><button className="button button-white" onClick={() => speak(dailyWord.arabic, 'ar-SA', setToast)}><Volume2 size={17} /> Dengarkan</button><button className="button button-ghost" onClick={() => selectPage('dictionary')}>Jelajahi kamus <ArrowRight size={15} /></button></div></div><div className="daily-feature-art"><div className="sun-disc">☀</div><div className="daily-letter">ع</div><span className="daily-orbit orbit-a" /><span className="daily-orbit orbit-b" /><span className="daily-spark spark-a">✦</span><span className="daily-spark spark-b">✧</span></div></section>
    <section className="section-block"><div className="section-heading"><div><p className="eyebrow">UNGKAPAN YANG SERING DIPAKAI</p><h2>Bekal percakapan sehari-hari</h2><p className="muted">Pilih ungkapan, lalu dengarkan cara pengucapannya.</p></div></div><div className="daily-phrase-list">{dailyPhrases.map((item, index) => <div className="phrase-row" key={item.id}><span className="phrase-number">{String(index + 1).padStart(2, '0')}</span><div className="phrase-main"><strong className="arabic-text" dir="rtl" lang="ar">{item.arabic}</strong><span>{item.indo}</span><small>{item.latin.trim()}</small></div><p className="phrase-example">{item.exampleId}</p><button className="sound-button" onClick={() => speak(item.arabic, 'ar-SA', setToast)} aria-label="Dengarkan ungkapan"><Volume2 size={18} /></button></div>)}</div></section>
  </div>;
}

function TutorPage({ aiQuestion, setAiQuestion, aiAnswer, aiLoading, handleTutor }) {
  const suggestions = ['Jelaskan perbedaan هٰذَا dan هٰذِهِ', 'Buat percakapan sederhana di pasar', 'Bagaimana cara memperkenalkan diri dalam bahasa Arab?'];
  return <div className="page-stack">
    <section className="page-title-row"><div><p className="eyebrow">TEMAN BELAJAR BAHASA ARAB</p><h1>Asisten AI</h1><p className="muted">Tanyakan arti kata, tata bahasa, atau minta latihan percakapan.</p></div><span className="ai-badge"><Sparkles size={15} /> Tutor virtual</span></section>
    <section className="tutor-card"><div className="tutor-card-head"><div className="tutor-avatar"><Sparkles size={23} /></div><div><strong>Ustadz AI <span className="online-dot" /></strong><p>Asisten belajar bahasa Arab Fusha</p></div><span className="tutor-head-tag">BETA</span></div><div className="tutor-welcome"><span className="tutor-welcome-icon">أهلاً وسهلاً</span><h2>Apa yang ingin kamu pelajari?</h2><p>Saya bisa membantu menerangkan kosakata, memberi contoh kalimat, dan berlatih percakapan. Tanyakan apa saja seputar bahasa Arab.</p></div><div className="suggestion-list">{suggestions.map((item) => <button key={item} onClick={() => setAiQuestion(item)}>{item}<ArrowRight size={15} /></button>)}</div><form className="tutor-input-form" onSubmit={handleTutor}><textarea value={aiQuestion} onChange={(event) => setAiQuestion(event.target.value)} placeholder="Tulis pertanyaanmu di sini…" rows={3} maxLength={1800} /><div className="tutor-input-foot"><span><Lightbulb size={14} /> Jawaban AI sebaiknya tetap diperiksa untuk konteks belajar formal.</span><button type="submit" className="button button-primary" disabled={aiLoading}>{aiLoading ? <><span className="button-spinner" /> Menjawab…</> : <>Tanya AI <Send size={15} /></>}</button></div></form>{aiAnswer && <div className="ai-answer-box"><div className="ai-answer-heading"><span><Sparkles size={16} /> Jawaban Asisten</span><span className="answer-label">AI</span></div><p>{aiAnswer}</p></div>}</section>
    <div className="tutor-disclaimer"><CircleHelp size={18} /><p><strong>Catatan:</strong> Fitur Asisten AI membutuhkan API key yang dikonfigurasi pada Netlify. Jangan masukkan informasi pribadi atau rahasia ke dalam percakapan.</p></div>
  </div>;
}

function QuizPage({ quizIndex, quizChoice, setQuizChoice, quizScore, quizChecked, quizDone, checkQuiz, nextQuiz, resetQuiz }) {
  const question = quizQuestions[quizIndex];
  if (quizDone) return <div className="quiz-wrap"><section className="quiz-card quiz-result"><div className="quiz-trophy">🏆</div><p className="eyebrow">LATIHAN SELESAI</p><h1>Bagus sekali!</h1><p className="muted">Kamu sudah menyelesaikan latihan kosakata kali ini.</p><div className="score-ring"><strong>{quizScore}/{quizQuestions.length}</strong><span>jawaban benar</span></div><p className="quiz-result-note">{quizScore >= 4 ? 'Hebat! Pertahankan semangat belajarmu.' : 'Terus berlatih. Ulangi kuis untuk memperkuat ingatanmu.'}</p><button className="button button-primary" onClick={resetQuiz}>Ulangi kuis <ArrowRight size={16} /></button></section></div>;
  return <div className="page-stack"><section className="page-title-row"><div><p className="eyebrow">UJI INGATANMU</p><h1>Latihan kuis</h1><p className="muted">Pilih jawaban yang paling tepat. Belajar bisa dimulai dari permainan kecil.</p></div><span className="quiz-progress-label"><GraduationCap size={17} /> Latihan pemula</span></section><div className="quiz-wrap"><section className="quiz-card"><div className="quiz-card-top"><span className="quiz-tag">KOSAKATA DASAR</span><span className="quiz-counter">Pertanyaan {quizIndex + 1} <span>/ {quizQuestions.length}</span></span></div><div className="quiz-progress"><span style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }} /></div><div className="quiz-question-block"><span className="quiz-question-icon"><CircleHelp size={22} /></span><p className="eyebrow">PILIH SATU JAWABAN</p><h2>{question.question}</h2></div><div className="quiz-options">{question.options.map((option, index) => { const correct = quizChecked && option === question.answer; const wrong = quizChecked && option === quizChoice && option !== question.answer; return <button key={option} disabled={quizChecked} className={`quiz-option ${quizChoice === option ? 'chosen' : ''} ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}`} onClick={() => setQuizChoice(option)}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span className={/[\u0600-\u06FF]/.test(option) ? 'arabic-text' : ''}>{option}</span>{correct && <Check size={17} />}{wrong && <X size={17} />}</button>; })}</div>{quizChecked && <div className={`quiz-feedback ${quizChoice === question.answer ? 'feedback-correct' : 'feedback-wrong'}`}><strong>{quizChoice === question.answer ? 'Tepat sekali!' : `Belum tepat. Jawaban yang benar: ${question.answer}`}</strong><p>{question.hint}</p></div>}<div className="quiz-card-bottom"><span><Zap size={15} /> Skor sementara: <strong>{quizScore}</strong></span>{quizChecked ? <button className="button button-primary" onClick={nextQuiz}>{quizIndex === quizQuestions.length - 1 ? 'Lihat hasil' : 'Pertanyaan berikutnya'} <ArrowRight size={15} /></button> : <button className="button button-primary" onClick={checkQuiz}>Periksa jawaban <ArrowRight size={15} /></button>}</div></section><p className="quiz-footnote"><Lightbulb size={15} /> Tidak perlu terburu-buru. Pahami arti kata, lalu coba lagi jika belum tepat.</p></div></div>;
}

export default App;
