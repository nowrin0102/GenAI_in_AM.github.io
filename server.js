require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

app.use(express.json());  // Middleware to parse JSON
app.use(cors());          // Allow cross-origin requests

const apiKey = process.env.API_KEY;  // Fetch API key from .env
console.log(apiKey)

// Route to handle AI message
app.post('/api/getAIResponse', async (req, res) => {
    const userMessage = req.body.message;

    const endpoint = "https://nowrinimage.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-02-15-preview";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey,  // Send API key securely in server request
            },
            body: JSON.stringify({
                messages: [{ role: "user", content: userMessage }],
            }),
        });

        if (!response.ok) {
            console.error("API error:", response.statusText);
            return res.status(500).json({ error: "Error fetching AI response." });
        }

        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });  // Return AI response to frontend
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
