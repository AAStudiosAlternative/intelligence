export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, identityInstruction } = req.body;

        if (!messages || !identityInstruction) {
            return res.status(400).json({ error: 'Messages and identity instruction are required' });
        }

        // Set up a timeout for the fetch request (8 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
            const deepSeekResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "deepseek-chat", // DeepSeek V3
                    messages: [
                        { role: "system", content: identityInstruction },
                        ...messages // Include the conversation history
                    ],
                    max_tokens: 30, // Kept low to prevent timeouts
                    temperature: 0.5 // Kept low for faster responses
                }),
                signal: controller.signal // Attach the AbortController signal
            });

            clearTimeout(timeoutId); // Clear the timeout if the request completes in time

            if (!deepSeekResponse.ok) {
                const errorData = await deepSeekResponse.json();
                throw new Error(errorData.error?.message || 'DeepSeek API request failed');
            }

            const data = await deepSeekResponse.json();
            const reply = data.choices[0].message.content;
            res.status(200).json({ response: reply });
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out');
            }
            throw error; // Re-throw other errors
        }
    } catch (error) {
        console.error('Error:', error.message);
        if (error.message === 'Request timed out') {
            res.status(504).json({ error: 'Elf AI Intelligence is slow—try again!' });
        } else {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}
