const Groq = require("groq-sdk");

require("dotenv").config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const suggestionsGenerator = async (prompt) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });
    const responseContent = chatCompletion.choices[0]?.message?.content || "";
    return responseContent;
  } catch (error) {
    console.error("Error generating suggestions:", error);
    throw new Error("Failed to generate suggestions");
  }
};

module.exports = suggestionsGenerator;
