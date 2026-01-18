const express = require("express");
const db = require("../config/db");
const router = express.Router();

/**
 * GENERATE LEARNING PATH
 */
router.post("/", (req, res) => {
  const { user_id, goal, daily_time } = req.body;

  if (!user_id || !goal || !daily_time) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Simple rule-based plan (can be upgraded later)
  let plan = [];

  if (goal.toLowerCase().includes("full")) {
    plan = [
      { week: 1, focus: "HTML & CSS Basics" },
      { week: 2, focus: "JavaScript Fundamentals" },
      { week: 3, focus: "React Basics" },
      { week: 4, focus: "Backend with Node.js" },
      { week: 5, focus: "MySQL & APIs" },
      { week: 6, focus: "Full Stack Project" }
    ];
  } else if (goal.toLowerCase().includes("frontend")) {
    plan = [
      { week: 1, focus: "HTML & CSS" },
      { week: 2, focus: "JavaScript" },
      { week: 3, focus: "React" },
      { week: 4, focus: "Advanced UI & Animations" }
    ];
  } else {
    plan = [
      { week: 1, focus: "Fundamentals" },
      { week: 2, focus: "Intermediate Concepts" },
      { week: 3, focus: "Projects" }
    ];
  }

  db.query(
    "INSERT INTO learning_paths (user_id, goal, daily_time, generated_plan) VALUES (?, ?, ?, ?)",
    [user_id, goal, daily_time, JSON.stringify(plan)],
    (err) => {
      if (err) return res.status(500).json({ error: err });

      res.status(201).json({
        message: "Learning path generated successfully",
        plan
      });
    }
  );
});

/**
 * GET USER LEARNING PATH
 */
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT * FROM learning_paths WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(404).json({ message: "No learning path found" });
      }

      res.json({
        goal: results[0].goal,
        daily_time: results[0].daily_time,
        plan: results[0].generated_plan
      });
    }
  );
});

/**
 * UPDATE WEEK PROGRESS
 */
router.put("/progress/:userId", (req, res) => {
  const { userId } = req.params;
  const { plan } = req.body; // updated plan array

  if (!plan) {
    return res.status(400).json({ message: "Plan data required" });
  }

  db.query(
    "UPDATE learning_paths SET generated_plan = ? WHERE user_id = ?",
    [JSON.stringify(plan), userId],
    (err) => {
      if (err) return res.status(500).json({ error: err });

      res.json({ message: "Progress updated" });
    }
  );
});


module.exports = router;
