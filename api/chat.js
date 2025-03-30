const axios = require("axios");

module.exports = async (req, res) => {
    try {
        // Check if the request method is POST
        if (req.method !== "POST") {
            res.status(405).json({ error: "Method not allowed" });
            return;
        }

        // Parse the request body
        const { message } = req.body;

        // Validate the payload
        if (!message) {
            res.status(400).json({ error: "Missing message" });
            return;
        }

        // Call DeepSeek API
        const deepSeekResponse = await axios.post(
            "https://api.deepseek.com/chat/completions",
            {
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "You are Elf AI Intelligence. Respond as Elf AI Intelligence and limit answers to 1-2 short sentences." },
                    { role: "user", content: message }
                ],
                max_tokens: 50,
                temperature: 0.7
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        // Extract the response from DeepSeek
        const responseText = deepSeekResponse.data.choices[0].message.content.trim();

        // Return the response as-is, trusting DeepSeek to include the identity naturally
        res.status(200).json({ response: responseText });
    } catch (error) {
        console.error("Error in /api/chat:", {
            message: error.message,
            response: error.response ? error.response.data : null,
            status: error.response ? error.response.status : null
        });
        res.status(500).json({ error: "Internal server error" });
    }
};
