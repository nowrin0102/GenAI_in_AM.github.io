require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
 
const app = express();
app.use(cors());
app.use(express.json());
 
const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY
}));
 
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await openai.createChatCompletion({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: message }]
        });
 
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
 
app.listen(3000, () => console.log('Server running on port 3000'));