const express = require("express");
const router = express.Router();
const Url = require("../models/url");
const shortid = require("shortid");

// Create a new shortened URL
router.post("/", async (req, res) => {
  const { url } = req.body;

  // Check if the URL is provided in the body
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Check if the URL already exists in the database
    const existingUrl = await Url.findOne({
      redirectURL: url,
      createdBy: req.user._id,
    });

    console.log(existingUrl);
    

    // If the URL exists, return an error message
    if (existingUrl) {
      return res
        .status(409)
        .json({ error: "This URL already exists in the system" });
    }

    // Generate a unique short ID
    const shortID = shortid.generate();

    // Save the new URL in the database
    const newUrl = await Url.create({
      shortID: shortID,
      redirectURL: url,
      visitHistory: [],
      createdBy: req.user._id,
    });

    // Render the home page with the new short URL ID
    // const allUrls = await Url.find({});

    return res.redirect("/");
  } catch (error) {
    console.error("Error occurred while saving URL:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Redirect to the original URL based on the short ID and track the visit
router.get("/:shortid", async (req, res) => {
  const { shortid } = req.params;

  try {
    const entry = await Url.findOneAndUpdate(
      { shortID: shortid },
      {
        $push: {
          visitHistory: {
            timeStamp: Date.now(),
          },
        },
      },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Error during URL redirection:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// router.get("/analytics/:shortid", async (req, res) => {
//   const shortID = req.params.shortid;
//   const result = await Url.findOne({ shortID });
//   return res.json({
//     totalClicks: result.visitHistory.length,
//     analytics: result.visitHistory,
//   });
// });

module.exports = router;
