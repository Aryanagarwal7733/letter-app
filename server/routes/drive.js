const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

// Initialize Google Drive API
const drive = google.drive('v3');

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  try {
    const token = authorization.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Save letter to Google Drive
router.post('/save-to-drive', verifyToken, async (req, res) => {
  try {
    const { title, content, userEmail } = req.body;

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials
    oauth2Client.setCredentials({
      access_token: req.user.access_token
    });

    // Create file metadata
    const fileMetadata = {
      name: `${title}.txt`,
      mimeType: 'text/plain',
    };

    // Create media
    const media = {
      mimeType: 'text/plain',
      body: content
    };

    // Upload file to Drive
    const response = await drive.files.create({
      auth: oauth2Client,
      resource: fileMetadata,
      media: media,
      fields: 'id,webViewLink'
    });

    res.json({
      success: true,
      fileId: response.data.id,
      webViewLink: response.data.webViewLink
    });

  } catch (error) {
    console.error('Error saving to Drive:', error);
    res.status(500).json({ error: 'Failed to save to Google Drive' });
  }
});

module.exports = router;
