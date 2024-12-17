const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./Routes/authRoutes");
const quizRoutes = require("./Routes/quizRoutes");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;
const mongoDBUrl = process.env.MONGO_URL;

mongoose
  .connect(mongoDBUrl, {
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use("/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
