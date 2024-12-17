require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (
  email,
  totalScore,
  maxScore,
  evaluatedResponses,
  suggestions
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const emailContent = `
    <h1>Your Quiz Results</h1>
    <p>Score: ${totalScore}/${maxScore}</p>
    <h2>Suggestions for improving your skills:</h2>
    <p>${suggestions}</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Quiz Results and Suggestions",
    html: emailContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
