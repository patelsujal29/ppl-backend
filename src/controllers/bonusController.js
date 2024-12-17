const { HintGenerator } = require("../utils/HintGenerator.js");

const getHintForQuestion = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Question is required." });
  }

  try {
    const hint = await HintGenerator(question);
    res.status(200).json({ question, hint });
  } catch (error) {
    console.error("Error generating hint:", error.message);
    res
      .status(500)
      .json({ message: "Failed to generate hint", error: error.message });
  }
};

module.exports = { getHintForQuestion };
