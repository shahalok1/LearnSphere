require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/enrollments", require("./routes/enrollments"));
app.use("/api/learning-path", require("./routes/learningPath"));
app.use("/api/community", require("./routes/community"));
app.use("/api/resume", require("./routes/resume"));
app.use("/api/certificate", require("./routes/certificate"));



// Test route
app.get("/", (req, res) => {
  res.send("LearnSphere backend is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
