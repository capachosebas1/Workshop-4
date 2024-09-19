const express = require('express');
const { anonymizeMessage, deanonymizeMessage } = require('./anonymizer');
const OpenAIClient = require('./openai');

const app = express();
const openai = new OpenAIClient(process.env.OPENAI_API_KEY);

app.use(express.json());

app.post('/anonymize', async (req, res) => {
  console.log('Recibida solicitud en /anonymize');
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Se requiere un mensaje' });
  }

  try {
    const { anonymizedMessage, tokenMap } = await anonymizeMessage(message);
    res.json({ anonymizedMessage, tokenMap });
  } catch (error) {
    console.error('Error al anonimizar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/deanonymize', async (req, res) => {
  console.log('Recibida solicitud en /deanonymize');
  const { anonymizedMessage, tokenMap } = req.body;
  
  if (!anonymizedMessage || !tokenMap) {
    return res.status(400).json({ error: 'Se requiere un mensaje anonimizado y un mapa de tokens' });
  }

  try {
    const message = await deanonymizeMessage(anonymizedMessage, tokenMap);
    res.json({ message });
  } catch (error) {
    console.error('Error al desanonimizar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Añade este endpoint de prueba
app.get('/test', (req, res) => {
  res.json({ message: 'El servidor está funcionando correctamente' });
});

app.post('/secureChatGPT', async (req, res) => {
  console.log('Recibida solicitud en /secureChatGPT');
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Se requiere un prompt' });
  }

  try {
    // Anonimizar el prompt
    const { anonymizedMessage: anonymizedPrompt, tokenMap } = await anonymizeMessage(prompt);

    // Enviar el prompt anonimizado a ChatGPT
    const anonymizedResponse = await openai.completeText(anonymizedPrompt);

    // Desanonimizar la respuesta
    const response = await deanonymizeMessage(anonymizedResponse, tokenMap);

    res.json({ response });
  } catch (error) {
    console.error('Error en secureChatGPT:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = app;