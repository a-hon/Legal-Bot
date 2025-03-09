const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');



// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const port = 8000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// Check if the Groq API key is available
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error('GROQ_API_KEY is missing!');
  process.exit(1);
}

// Route to handle legal advice requests
app.post('/api/ask-legal-advice', async (req, res) => {
  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    // Call the Groq API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        messages: [
          {
            role: 'system',
            content: 'You are a legal advisor. Please provide legal advice based on the user\'s question.. Your responses should only be yes or no'
          },
          {
            role: 'user',
            content: question
          }
        ],
        model: 'llama-3.3-70b-versatile',
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the response from the Groq API
    const legalAdvice = response.data.choices[0].message.content;
    res.json({ answer: legalAdvice });
  } catch (error) {
    console.error('Error communicating with Groq API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Legal Chatbot backend running at http://localhost:${port}`);
});
