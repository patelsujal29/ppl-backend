const Groq = require("groq-sdk"); // Replace with appropriate AI client if different
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const HintGenerator = async (question) => {
  const hintPrompt = `Provide a helpful hint for the following question without giving away the answer: "${question}". The hint should guide the user toward the answer without revealing it.`;
  const hintCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: hintPrompt }],
    model: "llama3-8b-8192",
  });

  const hint = hintCompletion.choices[0].message.content.trim();
  if (!hint) throw new Error("Failed to generate a hint.");
  return hint;
};

module.exports = {
  HintGenerator,
};
