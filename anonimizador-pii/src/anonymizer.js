const crypto = require('crypto');
const { getDb } = require('./db');

// Mapa para almacenar las correspondencias entre tokens y valores originales
const tokenMap = new Map();

/**
 * Genera un token alfanumérico único.
 * @param {string} prefix - Prefijo para el token (NAME_, EMAIL_, PHONE_).
 * @returns {string} Token generado.
 */
function generateToken(prefix) {
  return `${prefix}${crypto.randomBytes(6).toString('hex')}`;
}

/**
 * Anonimiza un mensaje reemplazando nombres, emails y números de teléfono con tokens.
 * @param {string} message - El mensaje original.
 * @returns {Promise<object>} Promesa que resuelve a un objeto con el mensaje anonimizado y el mapa de tokens.
 */
async function anonymizeMessage(message) {
  const nameRegex = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const phoneRegex = /\b\d{10}\b/g;

  const localTokenMap = {};

  message = message.replace(nameRegex, (match) => {
    const token = generateToken('NAME_');
    localTokenMap[token] = match;
    return token;
  });

  message = message.replace(emailRegex, (match) => {
    const token = generateToken('EMAIL_');
    localTokenMap[token] = match;
    return token;
  });

  message = message.replace(phoneRegex, (match) => {
    const token = generateToken('PHONE_');
    localTokenMap[token] = match;
    return token;
  });

  const db = getDb();
  await db.collection('tokens').insertOne(localTokenMap);

  return { anonymizedMessage: message, tokenMap: localTokenMap };
}

/**
 * Desanonimiza un mensaje reemplazando los tokens con los valores originales.
 * @param {string} anonymizedMessage - El mensaje anonimizado.
 * @param {object} tokenMap - Mapa de tokens a valores originales.
 * @returns {string} El mensaje original.
 */
async function deanonymizeMessage(anonymizedMessage, tokenMap) {
  const tokenRegex = /(NAME|EMAIL|PHONE)_[a-f0-9]{12}/g;

  return anonymizedMessage.replace(tokenRegex, (token) => {
    return tokenMap[token] || token;
  });
}

module.exports = {
  anonymizeMessage,
  deanonymizeMessage
};
