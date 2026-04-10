const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
const outputPath = path.join(root, 'env.js');

function parseDotEnv(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce((acc, line) => {
      const idx = line.indexOf('=');
      if (idx === -1) return acc;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      acc[key] = value;
      return acc;
    }, {});
}

const env = fs.existsSync(envPath)
  ? parseDotEnv(fs.readFileSync(envPath, 'utf8'))
  : process.env;

const config = {
  FIREBASE_API_KEY: env.FIREBASE_API_KEY || '',
  FIREBASE_AUTH_DOMAIN: env.FIREBASE_AUTH_DOMAIN || '',
  FIREBASE_PROJECT_ID: env.FIREBASE_PROJECT_ID || '',
  FIREBASE_STORAGE_BUCKET: env.FIREBASE_STORAGE_BUCKET || '',
  FIREBASE_MESSAGING_SENDER_ID: env.FIREBASE_MESSAGING_SENDER_ID || '',
  FIREBASE_APP_ID: env.FIREBASE_APP_ID || '',
  FIREBASE_DB_COLLECTION: env.FIREBASE_DB_COLLECTION || 'mapConfigs',
  FIREBASE_DB_DOCUMENT: env.FIREBASE_DB_DOCUMENT || 'HMG',
};

const fileContent = `window.__ENV__ = ${JSON.stringify(config, null, 2)};\n`;
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log(`Generated ${outputPath}`);
