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

        // Simulate a response (replace this with your actual logic, e.g., calling an AI service)
        const responseText = `${identityInstruction} I received your message: ${message}`;

        // Return the response
        return res.status(200).json({ response: responseText });
    } catch (error) {
        console.error("Error in /api/chat:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
