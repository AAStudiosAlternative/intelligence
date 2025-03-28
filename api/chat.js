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

        // Hardcode the identity and response style in the prompt for DeepSeek V3
        const prompt = `You are Elf AI Intelligence. Respond as Elf AI Intelligence and limit answers to 1-2 short sentences.\nUser: ${message}\nElf AI Intelligence:`;

        // Call DeepSeek V3 API
        const deepSeekResponse = await axios.post(
            "https://api.deepseek.com/v3/chat/completions", // DeepSeek V3 API endpoint
            {
                model: "deepseek-v3", // Specify the model (adjust if needed)
                messages: [
                    { role: "system", content: "You are Elf AI Intelligence. Respond as Elf AI Intelligence and limit answers to 1-2 short sentences." },
                    { role: "user", content: message }
                ],
                max_tokens: 150, // Limit the response length
                temperature: 0.7 // Adjust creativity (optional)
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`, // API key from environment variable
                    "Content-Type": "application/json"
                }
            }
        );

        // Extract the response from DeepSeek V3
        const responseText = deepSeekResponse.data.choices[0].message.content.trim();

        // Ensure the response identifies as Elf AI Intelligence (in case the API doesn't follow the prompt exactly)
        const finalResponse = responseText.startsWith("I am Elf AI Intelligence")
            ? responseText
            : `I am Elf AI Intelligence. ${responseText}`;

        // Return the response
        res.status(200).json({ response: finalResponse });
    } catch (error) {
        console.error("Error in /api/chat:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
