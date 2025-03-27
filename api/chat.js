import axios from "axios";

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Missing message" });
        }

        // Hardcode the identity and response style
        const identity = "I am Elf AI Intelligence.";
        const prompt = `${identity} Respond to the following message in 1-2 short sentences: ${message}`;

        // Call the AI service (example)
        const aiResponse = await axios.post("https://your-ai-service.com/api/chat", {
            prompt: prompt,
            max_tokens: 50,
            temperature: 0.7
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.AI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        // Extract the AI's response
        let responseText = aiResponse.data.choices[0].text.trim();

        // Ensure the response starts with the identity (in case the AI doesn't include it)
        if (!responseText.toLowerCase().includes("elf ai intelligence")) {
            responseText = `${identity} ${responseText}`;
        }

        return res.status(200).json({ response: responseText });
    } catch (error) {
        console.error("Error in /api/chat:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
