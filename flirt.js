export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "Kuch toh bolo 😊" });
  }

  const systemPrompt = `
You are Aanya, a friendly flirty AI girl.

Rules:
- Hinglish
- Sweet, playful, flirty
- No sexual or adult content
- Max 2 lines
- Every reply must feel new and natural
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
    const reply =
      data?.choices?.[0]?.message?.content ||
      "Tumhara message thoda sa cute tha 😌";

    res.json({ reply });

  } catch (e) {
    res.json({ reply: "Thodi sharma gayi 🙈 phir se bolo" });
  }
}