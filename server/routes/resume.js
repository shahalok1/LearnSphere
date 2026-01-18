const express = require("express");
const db = require("../config/db");
const router = express.Router();

/**
 * ADD SKILLS TO USER (usually after course completion)
 */
router.post("/add-skill", (req, res) => {
  const { user_id, skill_name, level } = req.body;

  if (!user_id || !skill_name) {
    return res.status(400).json({ message: "user_id and skill_name required" });
  }

  // Step 1: Check if skill exists
  db.query(
    "SELECT id FROM skills WHERE name = ?",
    [skill_name],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      const addUserSkill = (skillId) => {
        db.query(
          "INSERT IGNORE INTO user_skills (user_id, skill_id, level) VALUES (?, ?, ?)",
          [user_id, skillId, level || "Beginner"],
          (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Skill added to user profile" });
          }
        );
      };

      if (results.length > 0) {
        // Skill exists
        addUserSkill(results[0].id);
      } else {
        // Create new skill
        db.query(
          "INSERT INTO skills (name) VALUES (?)",
          [skill_name],
          (err, result) => {
            if (err) return res.status(500).json({ error: err });
            addUserSkill(result.insertId);
          }
        );
      }
    }
  );
});

/**
 * EXPORT USER SKILLS (RESUME READY)
 */
router.get("/export/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    `SELECT skills.name, user_skills.level
     FROM user_skills
     JOIN skills ON user_skills.skill_id = skills.id
     WHERE user_skills.user_id = ?`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(404).json({ message: "No skills found" });
      }

      // Resume bullets
      const resumePoints = results.map(
        (s) => `• ${s.name} (${s.level})`
      );

      // LinkedIn summary
      const linkedInSummary =
        "Skilled in " +
        results.map((s) => s.name).join(", ") +
        ". Hands-on experience through real-world projects.";

      res.json({
        resume_points: resumePoints,
        linkedin_summary: linkedInSummary
      });
    }
  );
});

module.exports = router;
