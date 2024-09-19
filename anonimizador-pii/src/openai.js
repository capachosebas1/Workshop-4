const axios = require('axios');

class OpenAIClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: 'https://api.openai.com/v1',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async completeText(prompt) {
    try {
      const response = await this.client.post('/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150
      });
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error al llamar a OpenAI:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
}

module.exports = OpenAIClient;