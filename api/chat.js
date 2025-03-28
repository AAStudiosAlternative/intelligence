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

        // Hardcode the identity and response style in the prompt for DeepSeek
        const prompt = `You are Elf AI Intelligence. Respond as Elf AI Intelligence and limit answers to 1-2 short sentences.\nUser: ${message}\nElf AI Intelligence:`;

        // Call DeepSeek API (updated endpoint and model name)
        const deepSeekResponse = await axios.post(
            "https://api.deepseek.com/chat/completions", // Corrected endpoint
            {
                model: "deepseek-chat", // Corrected model name for DeepSeek V3
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

        // Ensure the response identifies as Elf AI Intelligence
        const finalResponse = responseText.startsWith("I am Elf AI Intelligence")
            ? responseText
            : `I am Elf AI Intelligence. ${responseText}`;

        // Return the response
        res.status(200).json({ response: finalResponse });
    } catch (error) {
        // Log detailed error information
        console.error("Error in /api/chat:", {
            message: error.message,
            response: error.response ? error.response.data : null,
            status: error.response ? error.response.status : null
        });
        res.status(500).json({ error: "Internal server error" });
    }
};
