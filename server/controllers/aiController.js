const axios = require("axios");

const askAssistant = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const response = await axios.post(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    model: "mistralai/mistral-7b-instruct", // ✅ Replace with a valid OpenRouter model
    messages: [
      { role: "system", content: "You are a helpful study assistant." },
      { role: "user", content: prompt },
    ],
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "FocusPod AI Assistant",
    },
  }
);


    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("🔥 AI Error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI service failed" });
  }
};

module.exports = { askAssistant };
