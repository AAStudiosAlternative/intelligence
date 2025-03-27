import axios from "axios"; // For making HTTP requests to DeepSeek

export default async function handler(req, res) {
    try {
        // Check if the request method is POST
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        // Parse the request body
        const { message, identityInstruction } = req.body;

        // Validate the payload
        if (!message || !identityInstruction) {
            return res.status(400).json({ error: "Missing message or identityInstruction" });
        }

        // Call DeepSeek's API
        const deepSeekResponse = await axios.post(
            "https://api.deepseek.com/chat/completions",
            {
                model: "deepseek-chat", // Use DeepSeek's chat model (can be updated to deepseek-reasoner if needed)
                messages: [
                    { role: "system", content: identityInstruction }, // Set the identity and behavior
                    { role: "user", content: message } // User's message
                ],
                max_tokens: 200, // Limit the response length
                temperature: 0.7 // Adjust creativity (optional)
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`, // DeepSeek API key from environment variables
                    "Content-Type": "application/json"
                }
            }
        );

        // Extract the AI's response
        const responseText = deepSeekResponse.data.choices[0].message.content.trim();

        // Return the response
        return res.status(200).json({ response: responseText });
    } catch (error) {
        console.error("Error in /api/chat:", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}
