const jwt = require("jsonwebtoken");
const secret = "ishuashu@755"; // Ideally, store this in environment variables for security

// Function to sign a JWT for a user
function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    secret,
  );
}

// Function to verify and decode the JWT
function getUser(token) {
  if (!token) {
    return null; // Return null if no token is provided
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, secret);
    return decoded; // Return the decoded user payload (_id, email, etc.)
  } catch (error) {
    console.error("Invalid token:", error.message);
    return null; // Return null if the token is invalid or expired
  }
}

module.exports = {
  setUser,
  getUser,
};
