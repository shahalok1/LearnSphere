const express = require("express");
const db = require("../config/db");
const router = express.Router();

/**
 * GET ALL COURSES
 */
router.get("/", (req, res) => {
  db.query("SELECT * FROM courses", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

/**
 * ADD COURSE (Instructor only - for now no role check)
 */
router.post("/", (req, res) => {
  const { title, description, category, instructor_id } = req.body;

  if (!title || !category) {
    return res.status(400).json({ message: "Title and category required" });
  }

  db.query(
    "INSERT INTO courses (title, description, category, instructor_id) VALUES (?, ?, ?, ?)",
    [title, description, category, instructor_id || null],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: "Course added successfully" });
    }
  );
});

module.exports = router;
