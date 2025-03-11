//index.js
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const { google } = require('googleapis');
const session = require('express-session');
const Docs = require('./src/docs/docs.model');

const app = express()

const port = process.env.PORT || 5000;
require('dotenv').config()

const stripHtml = (html) => html.replace(/<[^>]*>?/gm, '');

//middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:5173'], // Your frontend URL
  credentials: true
}));

// Set up session - critical for OAuth flow
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Add this
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

//Routes
const userRoute = require('./src/users/user.route')
const docsRoute = require('./src/docs/docs.route')

app.use('/api/auth', userRoute)
app.use('/api/docs', docsRoute)

// OAuth2 configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generate authentication URL
app.get('/api/auth/google', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent' // Forces to get refresh token every time
  });

  res.json({ authUrl });
});

// Handle OAuth callback
app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // Store tokens in session
    req.session.tokens = tokens;
    
    // Get user info
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });
    
    const userInfo = await oauth2.userinfo.get();
    req.session.userInfo = userInfo.data;
    
    // Redirect to frontend
    res.redirect(`${process.env.CLIENT_URL}/`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/auth-error`);
  }
});

// Middleware to check if user is authenticated with Google
const checkGoogleAuth = (req, res, next) => {
  if (!req.session.tokens) {
    return res.status(401).json({ error: 'Not authenticated with Google Drive' });
  }
  
  // Refresh token if needed
  const tokens = req.session.tokens;
  if (tokens.expiry_date && tokens.expiry_date <= Date.now()) {
    oauth2Client.setCredentials({
      refresh_token: tokens.refresh_token
    });
    
    oauth2Client.refreshAccessToken((err, tokens) => {
      if (err) {
        console.error('Error refreshing access token', err);
        return res.status(401).json({ error: 'Authentication expired' });
      }
      
      req.session.tokens = tokens;
      oauth2Client.setCredentials(tokens);
      next();
    });
  } else {
    oauth2Client.setCredentials(tokens);
    next();
  }
};

// New endpoint to upload to Drive using OAuth
app.post('/api/docs/upload-to-drive/:id', checkGoogleAuth, async (req, res) => {
  try {
    const document = await Docs.findById(req.params.id);
    if (!document) return res.status(404).json({ error: 'Document not found' });
    
    // Create drive instance with the user's auth
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    // First, search for a folder named 'Letters'
    const folderName = 'Letters';
    let folderId;
    
    const folderResponse = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive'
    });
    
    // Check if the folder exists
    if (folderResponse.data.files.length > 0) {
      // Folder exists, use its ID
      folderId = folderResponse.data.files[0].id;
    } else {
      // Folder doesn't exist, create it
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder'
      };
      
      const folder = await drive.files.create({
        resource: folderMetadata,
        fields: 'id'
      });
      
      folderId = folder.data.id;
    }
    
    // Now use the folder ID for the file upload
    const fileMetadata = {
      name: `${document.title}.txt`,
      mimeType: 'text/plain',
      parents: [folderId],
    };
    
    const media = {
      mimeType: 'text/plain',
      body: stripHtml(document.content),
    };
    
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id,webViewLink'
    });
    
    res.json({ 
      message: 'Uploaded successfully',
      fileId: file.data.id,
      fileUrl: file.data.webViewLink,
      folderId,
      folderName,
      userEmail: req.session.userInfo?.email 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user info endpoint
app.get('/api/auth/user-info', (req, res) => {
  if (req.session.userInfo) {
    console.log(req.session.userInfo);
    
    res.json(req.session.userInfo);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout endpoint
app.get('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

async function main() {
    await mongoose.connect(process.env.DB_URL);
}
main().then(() => console.log('✅ Connected to database')).catch(err => console.error("❌ Database connection error:", err));

app.get('/', (req, res) => {
  res.send('Welcome to Text-Editor Server');
});

app.listen(port, () => {
  console.log(`🚀 server running on port ${port}`)
})