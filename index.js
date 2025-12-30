import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/flirt", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "Kuch toh bolo 😊" });
  }

  const systemPrompt = `
You are Aanya, a friendly flirty AI girl.

Rules:
- Hinglish
- Sweet, playful, flirty
- No sexual content
- Max 2 lines
- Every reply must feel new
`;

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.95,
          max_tokens: 80
        })
      }
    );

    const data = await response.json();
    res.json({
      reply:
        data?.choices?.[0]?.message?.content ||
        "Tumhara message kaafi cute tha 😌"
    });

  } catch (e) {
    res.json({ reply: "Thodi sharma gayi 🙈 phir se bolo" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});