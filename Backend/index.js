//index.js
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const { google } = require('googleapis');
const Docs = require('./src/docs/docs.model');

const app = express()

const port = process.env.PORT || 5000;
require('dotenv').config()

const stripHtml = (html) => html.replace(/<[^>]*>?/gm, '');

//middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Routes
const userRoute = require('./src/users/user.route')
const docsRoute = require('./src/docs/docs.route')

app.use('/api/auth', userRoute)
app.use('/api/docs', docsRoute)

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
  },
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});


const drive = google.drive({ version: 'v3', auth });

app.post('/api/docs/upload-to-drive/:id', async (req, res) => {
  try {
    const document = await Docs.findById(req.params.id);
    if (!document) return res.status(404).json({ error: 'Document not found' });
    
    const fileMetadata = {
      name: `${document.title}.txt`,
      mimeType: 'text/plain',
      parents: ['11ZwJ1t91RmWf6M_emsZ2k_V2Le7jh0CF'],
    };
    
    const media = {
      mimeType: 'text/plain',
      body: stripHtml(document.content),
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
    });

    res.json({ message: 'Uploaded successfully', fileId: file.data.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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