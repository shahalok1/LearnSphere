const express = require("express");
const db = require("../config/db");
const router = express.Router();

/**
 * ENROLL IN COURSE
 */
router.post("/", (req, res) => {
  const { user_id, course_id } = req.body;

  db.query(
    "INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)",
    [user_id, course_id],
    (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Already enrolled" });
        }
        return res.status(500).json({ error: err });
      }

      res.status(201).json({ message: "Enrolled successfully" });
    }
  );
});

/**
 * GET USER ENROLLMENTS
 */
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    `SELECT courses.* FROM courses
     JOIN enrollments ON courses.id = enrollments.course_id
     WHERE enrollments.user_id = ?`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

module.exports = router;
