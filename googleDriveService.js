const { google } = require("googleapis");
const fs = require("fs");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });

async function uploadToGoogleDrive(content, title) {
  const fileMetadata = {
    name: `${title}.docx`,
    mimeType: "application/vnd.google-apps.document",
  };

  const media = {
    mimeType: "text/plain",
    body: content,
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id",
  });

  return response.data.id;
}

module.exports = { uploadToGoogleDrive };
