const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per minute
    message: 'Too many requests, please try again later.'
});

router.use(limiter);

router.post('/', async (req, res) => {
    try {
        if (!req.body.messages || !req.body.identityInstruction) {
            return res.status(400).json({ error: 'Messages and identity instruction are required' });
        }

        const deepSeekResponse = await axios.post(
            "https://api.deepseek.com/chat/completions",
            {
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: req.body.identityInstruction },
                    ...req.body.messages
                ],
                max_tokens: 150,
                temperature: 0.7
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const reply = deepSeekResponse.data.choices[0].message.content;
        res.json({ response: reply });
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data.error.message });
        } else if (error.code === 'ECONNABORTED') {
            res.status(504).json({ error: 'Request timed out' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

module.exports = router;
