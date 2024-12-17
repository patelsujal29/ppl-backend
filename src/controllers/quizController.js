require("dotenv").config();
const Groq = require("groq-sdk");
const Quiz = require("../models/Quiz");
const User = require("../models/User");
const Submission = require("../models/Submission");
const suggestionsGenerator = require("../utils/suggestionsGenerator");
const sendEmail = require("../utils/sendEmail");
const mongoose = require("mongoose");
const {
  generateQuestion,
  generateOptions,
  generateCorrectAnswer,
} = require("../utils/Quizgenerator");

//to generate quiz
const generateQuiz = async (req, res) => {
  const { grade, subject, totalQuestions, maxScore, difficulty } = req.body;
  const userId = req.userId;

  try {
    const quizQuestions = [];
    const weightPerQuestion = maxScore / totalQuestions;

    for (let i = 0; i < totalQuestions; i++) {
      const question = await generateQuestion(grade, subject, difficulty);
      const options = await generateOptions(question);
      const correctAnswer = await generateCorrectAnswer(question, options);

      quizQuestions.push({ question, options, correctAnswer });
    }

    const quiz = new Quiz({
      grade,
      subject,
      difficulty,
      maxScore,
      weightPerQuestion,
      questions: quizQuestions,
    });

    const savedQuiz = await quiz.save();
    await User.findByIdAndUpdate(userId, {
      $addToSet: { quizzesCreated: savedQuiz._id },
    });

    res.status(201).json({
      quizId: savedQuiz._id,
      questions: savedQuiz.questions.map((q) => ({
        questionId: q._id,
        question: q.question,
        options: q.options,
      })),
    });
  } catch (error) {
    console.error("Error generating quiz:", error.message);
    res
      .status(500)
      .json({ message: error.message || "Failed to generate quiz" });
  }
};

// To Submit Quiz
const submitQuiz = async (req, res) => {
  const { quizId, responses, email } = req.body;
  const userId = req.userId;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;

    responses.forEach(({ questionId, userResponse }) => {
      const question = quiz.questions.id(questionId);
      if (question && question.correctAnswer === userResponse) {
        score += quiz.weightPerQuestion;
      }
    });

    const submission = new Submission({
      userId,
      quizId,
      responses,
      score,
      completedAt: new Date(),
    });

    await submission.save();

    //update user Db
    await User.findByIdAndUpdate(userId, {
      $addToSet: { quizzesAttempted: quizId },
    });

    //for mail the score
    if (email !== undefined) {
      const suggestionsPrompt = `
        Based on the following performance in a quiz, provide two short skill improvement suggestions in second person
        (give entire two suggestions in one square bracket):
        Score: ${score}/${quiz.maxScore}
        Performance: ${responses
          .map(
            (response) => `
          Question: ${response.questionText}, Correct: ${
              response.isCorrect ? "Yes" : "No"
            }
        `
          )
          .join(" ")}
      `;
      const aiResponse = await suggestionsGenerator(suggestionsPrompt);
      const AIsuggestions = aiResponse?.match(/\[(.*?)\]/)[1];

      await sendEmail(email, score, quiz.maxScore, responses, AIsuggestions);
    }
    res.status(201).json({
      message: "Quiz submitted successfully",
      score,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ message: "Failed to submit quiz" });
  }
};

//get old created quiz
const getQuizById = async (req, res) => {
  const { Quizid } = req.params;
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("quizzesCreated");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidUser = user.quizzesCreated.some(
      (createdQuizId) => createdQuizId.toString() === Quizid
    );

    if (!isValidUser) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to this quiz" });
    }
    const quiz = await Quiz.findById(Quizid);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res
      .status(200)
      .json({ message: "Quiz retrieved successfully", data: quiz });
  } catch (error) {
    console.error("Error retrieving quiz:", error);
    res.status(500).json({ message: error.message });
  }
};

//to get all detail of submitted Quiz- que,correct ans,response
const getSubmittedQuiz = async (req, res) => {
  const { grade, subject, score, from, to } = req.query;
  const userId = req.userId;

  const query = { userId: new mongoose.Types.ObjectId(userId) };

  if (grade) {
    query.grade = Number(grade);
  }
  if (subject) {
    query.subject = subject;
  }
  if (score) {
    query.score = { ...query.score, $gte: Number(score) };
  }
  if (from || to) {
    query.submittedDate = {};
    if (from) {
      query.submittedDate.$gte = new Date(from);
    }
    if (to) {
      query.submittedDate.$lte = new Date(to);
    }
  }

  try {
    const submissions = await Submission.find(query).populate("quizId").exec();
    res.status(200).json(submissions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving quiz history", error: error.message });
  }
};

//to get basic info quizzes creted by user-don't set que set for that use getQuizById
const getUserQuizzes = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId)
      .populate({
        path: "quizzesCreated",
        select: "grade subject difficulty maxScore createdAt",
      })
      .populate({
        path: "quizzesAttempted",
        select: "grade subject difficulty maxScore createdAt",
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      quizzesCreated: user.quizzesCreated,
      quizzesAttempted: user.quizzesAttempted,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving user quizzes",
      error: error.message,
    });
  }
};

module.exports = {
  generateQuiz,
  submitQuiz,
  getQuizById,
  getSubmittedQuiz,
  getUserQuizzes,
};
