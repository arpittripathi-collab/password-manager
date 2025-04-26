// server/models/EncDecManager.js

// 1. Load .env immediately:
require('dotenv').config();

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

// 2. Validate & parse the key:
const keyHex = process.env.CRYPTO_SECRET_KEY;
if (!keyHex) {
  throw new Error('CRYPTO_SECRET_KEY environment variable is not set');
}
const key = Buffer.from(keyHex, 'hex');
if (key.length !== 32) {
  throw new Error('CRYPTO_SECRET_KEY must be a 64-char hex string (32 bytes)');
}

/**
 * Encrypt a UTF-8 string.
 * @param {string} plaintext
 * @returns {{ iv: string, encryptedData: string }}
 */
function encrypt(plaintext) {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final()
    ]);
    return {
      iv: iv.toString('hex'),
      // use hex for both fields for consistency
      encryptedData: encrypted.toString('hex'),
    };
  } catch (err) {
    console.error('Encryption error:', err);
    throw err;
  }
}

/**
 * Decrypt data previously encrypted with `encrypt()`.
 * @param {string} encryptedHex  – hex string
 * @param {string} ivHex         – hex string
 * @returns {string}             – the original UTF-8 plaintext
 */
function decrypt(encryptedHex, ivHex) {
  try {
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    return decrypted.toString('utf8');
  } catch (err) {
    console.error('Decryption error:', err);
    throw err;
  }
}

module.exports = { encrypt, decrypt };
