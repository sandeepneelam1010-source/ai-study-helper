require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

/* -------------------- CORS CONFIG -------------------- */
/* allow requests from your deployed website */
app.use(
  cors({
    origin: [
      "https://ai-study-helper-alpha.vercel.app",
      "http://localhost:8081",
      "http://localhost:19006"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());

/* -------------------- TEST ROUTE -------------------- */
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

/* -------------------- AI ENDPOINT -------------------- */
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ answer: "Question is required" });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a helpful study assistant." },
          { role: "user", content: question }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const answer = response.data.choices[0].message.content;

    res.json({ answer });

  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);

    res.status(500).json({
      answer: "AI server error"
    });
  }
});

/* -------------------- START SERVER -------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});