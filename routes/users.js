const express = require("express");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/users");
const { setUser } = require("../service/auth");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the email is already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send("Email already registered.");
  }

  // Create new user if email is unique
  await User.create({ name, email, password });
  return res.redirect("/");
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if the email is already registered
  const user = await User.findOne({ email, password });
  if (!user) {
    // Render an HTML page with an error dialog box
    return res.send(`
      <script>
        alert("Invalid email or password");
        window.location.href = "/login"; // Redirect back to the login page
      </script>
    `);
  }
  const token = setUser(user);
  res.cookie("uid", token);
  return res.redirect("/");
});

module.exports = router;
