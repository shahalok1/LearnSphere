const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../config/db");

const router = express.Router();

/**
 * SIGNUP
 */
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length > 0) {
        return res.status(409).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role || "student"],
        (err) => {
          if (err) return res.status(500).json({ error: err });

          res.status(201).json({ message: "User registered successfully" });
        }
      );
    }
  );
});

/**
 * LOGIN
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }
  );
});

/**
 * FORGOT PASSWORD
 */
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  db.query(
    "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
    [resetToken, expiry, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Password reset token generated",
        resetToken
      });
    }
  );
});

/**
 * RESET PASSWORD
 */
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  db.query(
    `UPDATE users 
     SET password = ?, reset_token = NULL, reset_token_expiry = NULL 
     WHERE reset_token = ? AND reset_token_expiry > NOW()`,
    [hashedPassword, token],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.affectedRows === 0) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      res.json({ message: "Password reset successful" });
    }
  );
});

/**
 * EXPORT ROUTER (ALWAYS LAST)
 */
module.exports = router;
