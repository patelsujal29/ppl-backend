const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  grade: { type: Number, required: true },
  subject: { type: String, required: true },
  difficulty: {
    type: String,
    required: true,
  },
  maxScore: { type: Number, required: true },
  weightPerQuestion: { type: Number, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: true },
      correctAnswer: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", quizSchema);
