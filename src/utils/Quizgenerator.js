require("dotenv").config();
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateQuestion = async (grade, subject, difficulty) => {
  const questionPrompt = `Give a single question for grade ${grade} on the subject of ${subject}. Difficulty level: ${difficulty}. Provide only the question, no extra text.`;
  const questionCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: questionPrompt }],
    model: "llama3-8b-8192",
  });

  const question = questionCompletion.choices[0].message.content.trim();
  if (!question) throw new Error("Failed to generate a valid question.");
  return question;
};

const generateOptions = async (question) => {
  const optionsPrompt = `Provide exactly four unique multiple-choice options for the question: "${question}". Each option must be on a new line. Do not include the question text, only options.Contain one correct ans.`;
  const optionsCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: optionsPrompt }],
    model: "llama3-8b-8192",
  });

  const rawOptions = optionsCompletion.choices[0].message.content
    .trim()
    .split("\n")
    .map((opt) => opt.trim())
    .filter(Boolean);

  const options = [...new Set(rawOptions)];
  if (options.length !== 4) throw new Error("Failed to generate 4 options.");
  return options;
};

const generateCorrectAnswer = async (question, options) => {
  const answerPrompt = `Based on the question: "${question}" and these options: ${options.join(
    ", "
  )}, provide the correct answer. Respond with only the text of the correct answer.`;
  const answerCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: answerPrompt }],
    model: "llama3-8b-8192",
  });

  const correctAnswer = answerCompletion.choices[0].message.content.trim();
  if (!options.includes(correctAnswer)) {
    throw new Error("Correct answer does not match the options.");
  }
  return correctAnswer;
};

module.exports = {
  generateQuestion,
  generateOptions,
  generateCorrectAnswer,
};
