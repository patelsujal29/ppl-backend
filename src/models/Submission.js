const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  responses: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
      userResponse: { type: String, required: true },
    },
  ],
  score: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submission", submissionSchema);
