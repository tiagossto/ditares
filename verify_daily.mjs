import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('client/public/ditados.json', 'utf8'));
const valid = data.length === 5 && data.every((item) => typeof item.data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.data));
if (!valid) {
  console.error('JSON diário inválido');
  process.exit(1);
}
console.log(`DAILY_JSON_OK: ${data.length} dated entries`);
