import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Cara pakai: npm run import:vocabulary -- ./kamus-arab-generated.json');
  process.exit(1);
}
const resolvedInput = path.resolve(process.cwd(), inputPath);
if (!fs.existsSync(resolvedInput)) {
  console.error(`File tidak ditemukan: ${resolvedInput}`);
  process.exit(1);
}
const parsed = JSON.parse(fs.readFileSync(resolvedInput, 'utf8'));
const incoming = Array.isArray(parsed) ? parsed : parsed.words;
if (!Array.isArray(incoming)) {
  console.error('Format JSON harus berupa array kosakata atau objek dengan properti "words".');
  process.exit(1);
}
const outputPath = path.join(root, 'src', 'data', 'vocabulary-imported.js');
const currentSource = fs.readFileSync(outputPath, 'utf8');
const match = currentSource.match(/export const importedVocabulary = (\[[\s\S]*?\]);?\s*$/);
let current = [];
if (match) {
  try { current = JSON.parse(match[1]); } catch { current = []; }
}
const normalize = (value = '') => String(value).normalize('NFD').replace(/[\u064B-\u065F\u0670\u0640]/g, '').trim().toLocaleLowerCase('id-ID');
const existingModule = await import(pathToFileURL(path.join(root, 'src', 'data', 'vocabulary.js')).href);
const existingWords = existingModule.vocabulary || [];
const arabicSeen = new Set([...current, ...existingWords].map((item) => normalize(item.arabic))); 
const accepted = [];
for (const item of incoming) {
  if (!item || typeof item.arabic !== 'string' || typeof item.indo !== 'string') continue;
  const arabic = item.arabic.trim();
  const indo = item.indo.trim();
  if (!arabic || !indo) continue;
  const arabicKey = normalize(arabic);
  if (arabicSeen.has(arabicKey)) continue;
  accepted.push({
    arabic,
    latin: String(item.latin || '').trim(),
    indo,
    category: String(item.category || 'keseharian'),
    emoji: String(item.emoji || '📘'),
    exampleAr: String(item.exampleAr || '').trim(),
    exampleId: String(item.exampleId || '').trim(),
    ...(item.image ? { image: String(item.image) } : {}),
  });
  arabicSeen.add(arabicKey);
}
const combined = [...current, ...accepted];
fs.writeFileSync(outputPath, `// Kosakata AI yang sudah ditinjau dan diimpor dari JSON.\nexport const importedVocabulary = ${JSON.stringify(combined, null, 2)};\n`, 'utf8');
console.log(`Berhasil menambahkan ${accepted.length} kosakata baru. Total kosakata impor: ${combined.length}.`);
if (!accepted.length) console.log('Tidak ada entri baru; semua entri kosong atau terduplikasi.');
