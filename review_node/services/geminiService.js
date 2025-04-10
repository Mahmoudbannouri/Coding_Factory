const axios = require('axios');

class GeminiAIService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    }

    async analyzeSentiment(text) {
        const prompt = `You are an expert educational consultant. Your sole purpose is to provide concise and actionable suggestions for professors based on student feedback give him technical advices he can do also on points titles . You MUST provide a suggestion for the professor. Absolutely do not address the student. Output should be starting with 'Professor, ...' Limit max 50 words in one senetence . Feedback:   "${text}"`;
        const response = await axios.post(`${this.baseUrl}?key=${this.apiKey}`, {
            contents: [{ parts: [{ text: prompt }] }]
        });

        return {
            suggestion: response.data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
        };
    }
}

module.exports = new GeminiAIService();
