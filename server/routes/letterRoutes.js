const express = require("express");
const { uploadToGoogleDrive } = require("../services/googleDriveService");

const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const { content, title } = req.body;
    const fileId = await uploadToGoogleDrive(content, title);
    res.status(200).json({ success: true, fileId });
  } catch (error) {
    console.error("Error saving letter:", error);
    res.status(500).json({ success: false, error: "Failed to save letter" });
  }
});

module.exports = router;
