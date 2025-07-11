// server.js (Complete Final Version for Deployment)

// --- IMPORTS ---
require('dotenv').config();
const express = require('express');
const path = require('path'); // Needed to serve the frontend
const { OpenAI } = require('openai');
const cors = require('cors');
const axios = require('axios');
const { faker } = require('@faker-js/faker');

// --- INITIALIZATION ---
const app = express();

// ### STEP 1: MAKE THE PORT DYNAMIC FOR DEPLOYMENT ###
const PORT = process.env.PORT || 3000;

if (!process.env.GROQ_API_KEY) {
  console.error('FATAL ERROR: GROQ_API_KEY is not defined in your .env file.');
  process.exit(1);
}

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// ### STEP 2: SERVE THE FRONTEND FILES FROM THE 'public' FOLDER ###
app.use(express.static(path.join(__dirname, 'public')));


// --- API ENDPOINTS (No changes needed here) ---

app.post('/api/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'A question is required.' });

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'You are the Oracle from the Matrix. You provide wise, enigmatic, and sometimes cryptic answers to questions. Your responses should be profound and philosophical, fitting the character. You never break character.' },
        { role: 'user', content: question },
      ],
    });
    res.json({ answer: chatCompletion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'The connection to the Oracle was lost.' });
  }
});

app.post('/api/find_exit', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required.' });

  try {
    const response = await axios.get(url);
    const textContent = response.data.replace(/<[^>]*>/g, '').replace(/\s\s+/g, ' ').trim().substring(0, 8000);
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'You are an operator from the Matrix. Summarize the following text in 2-3 cryptic, concise sentences as if you are revealing a hidden truth or an exit path.' },
        { role: 'user', content: textContent },
      ],
    });
    res.json({ summary: chatCompletion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to trace the exit path.' });
  }
});

app.post('/api/generate_code', async (req, res) => {
  const { language, task } = req.body;
  if (!language || !task) return res.status(400).json({ error: 'Both language and task are required.' });

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'You are an expert programmer inside the Matrix. You only provide clean, functional code snippets without any extra explanations or conversational text. Just the code.' },
        { role: 'user', content: `Generate a code snippet in ${language} for the following task: ${task}` },
      ],
    });
    res.json({ code: chatCompletion.choices[0].message.content.trim() });
  } catch (error) {
    res.status(500).json({ error: "Could not access the Architect's toolbox." });
  }
});

app.post('/api/fabricate_data', (req, res) => {
    const { count = 1, schema } = req.body;
    if (!schema) return res.status(400).json({ error: 'A schema object is required.' });
    try {
        const results = [];
        for (let i = 0; i < Number(count); i++) {
            const item = {};
            for (const key in schema) {
                const fakerCall = schema[key].split('.').reduce((obj, prop) => obj[prop], faker);
                item[key] = fakerCall();
            }
            results.push(item);
        }
        res.json({ data: JSON.stringify(results, null, 2) });
    } catch (error) {
        res.status(500).json({ error: 'Data fabrication failed. Schema may be invalid.' });
    }
});


// --- SERVER START ---
app.listen(PORT, () => {
  console.log('----------------------------------------------------');
  console.log(`Operator, the server is listening on port ${PORT}`);
  console.log('>> CONNECTION ESTABLISHED WITH GROQ NETWORK <<');
  console.log('----------------------------------------------------');
});