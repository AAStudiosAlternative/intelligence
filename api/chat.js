export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { message, identityInstruction } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing "message" in request body.' });
  }

  if (!identityInstruction || typeof identityInstruction !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing "identityInstruction" in request body.' });
  }

  try {
    const payload = {
      model: "deepseek-v3", // DeepSeek v3 model
      messages: [
        { role: "system", content: identityInstruction },
        { role: "user", content: message }
      ],
      max_tokens: 200 // Limit to 200 tokens
    };

    const response = await fetch("https://api.deepseek.com/v3/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("DeepSeek API error:", JSON.stringify(errorData, null, 2));
      if (response.status === 401) {
        return res.status(401).json({ error: "Invalid DeepSeek API key." });
      }
      return res.status(response.status).json({ error: errorData.error || "Failed to fetch response from DeepSeek." });
    }

    const data = await response.json();
    const assistantResponse = data.choices?.[0]?.message?.content;

    if (!assistantResponse) {
      console.error("Unexpected DeepSeek response format:", JSON.stringify(data, null, 2));
      return res.status(500).json({ error: "Invalid response format from DeepSeek." });
    }

    res.status(200).json({ response: assistantResponse });
  } catch (error) {
    console.error("Error in Vercel API:", error.message)
