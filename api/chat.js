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

        // The identityInstruction tells us how to behave, but we won't include it in the response
        // For now, we'll simulate a response as Elf AI Intelligence
        const responseText = `I received your message: ${message}`; // Simple response without the identityInstruction

        // Return the response
        return res.status(200).json({ response: responseText });
    } catch (error) {
        console.error("Error in /api/chat:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
