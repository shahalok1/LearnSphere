const express = require("express");
const db = require("../config/db");

const router = express.Router();

/**
 * GET messages for a room
 */
router.get("/:roomId", (req, res) => {
  const { roomId } = req.params;

  db.query(
    `
    SELECT c.message, c.created_at, u.name
    FROM community_messages c
    JOIN users u ON c.user_id = u.id
    WHERE c.room_id = ?
    ORDER BY c.created_at ASC
    `,
    [roomId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

/**
 * POST message to room
 */
router.post("/", (req, res) => {
  const { room_id, user_id, message } = req.body;

  if (!room_id || !user_id || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query(
    `
    INSERT INTO community_messages (room_id, user_id, message)
    VALUES (?, ?, ?)
    `,
    [room_id, user_id, message],
    (err) => {
      if (err) return res.status(500).json({ error: err });

      res.status(201).json({ message: "Message sent successfully" });
    }
  );
});

module.exports = router;
