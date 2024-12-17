const express = require("express");
const {
  generateQuiz,
  submitQuiz,
  getQuizById,
  getSubmittedQuiz,
  getUserQuizzes,
} = require("../controllers/quizController");

const { getHintForQuestion } = require("../controllers/bonusController");
const authenticateUser = require("../middleware/authenticateUser");
const router = express.Router();

router.post("/generate", authenticateUser, generateQuiz);
router.post("/submit", authenticateUser, submitQuiz);
router.get("/submitted-quiz", authenticateUser, getSubmittedQuiz);
router.get("/userquizes", authenticateUser, getUserQuizzes);
router.get("/oldquiz/:Quizid", authenticateUser, getQuizById);

//to save retry as another submission don't rewrite the old
router.get("/retry", authenticateUser, submitQuiz);

//bonuce route
router.get("/hint", authenticateUser, getHintForQuestion);

module.exports = router;
