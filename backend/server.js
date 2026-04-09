require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

app.post("/ask", async (req, res) => {
  const question = req.body.question;

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
    console.error(error.response?.data || error.message);
    res.status(500).json({ answer: "AI server error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});